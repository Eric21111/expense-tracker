import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { getCurrentUserEmail, getUserStorageKey } from "../services/dataIsolationService";

let navigateFunction = null;

const getTutorialData = (key) => {
    try {
        const userEmail = getCurrentUserEmail();
        if (!userEmail) {
            
            return localStorage.getItem(key);
        }
        const userKey = getUserStorageKey(`tutorial_${key}`, userEmail);
        return localStorage.getItem(userKey);
    } catch (error) {
        console.error(`Error getting tutorial data for ${key}:`, error);
        return null;
    }
};

const setTutorialData = (key, value) => {
    try {
        const userEmail = getCurrentUserEmail();
        if (!userEmail) {
            
            localStorage.setItem(key, value);
            return;
        }
        const userKey = getUserStorageKey(`tutorial_${key}`, userEmail);
        localStorage.setItem(userKey, value);
    } catch (error) {
        console.error(`Error setting tutorial data for ${key}:`, error);
    }
};

const removeTutorialData = (key) => {
    try {
        const userEmail = getCurrentUserEmail();
        if (!userEmail) {
            
            localStorage.removeItem(key);
            return;
        }
        const userKey = getUserStorageKey(`tutorial_${key}`, userEmail);
        localStorage.removeItem(userKey);
    } catch (error) {
        console.error(`Error removing tutorial data for ${key}:`, error);
    }
};

export const setNavigateFunction = (navigate) => {
    navigateFunction = navigate;
};

const resetTutorialData = async () => {
    try {
        const { deleteAccount } = await import('../services/accountApiService');
        const { deleteBudget } = await import('../services/budgetApiService');
        const { getAccounts } = await import('../services/accountApiService');
        const { getBudgets } = await import('../services/budgetApiService');

        const accounts = await getAccounts();
        const accountsList = Array.isArray(accounts) ? accounts : (accounts.accounts || []);
        const tutorialAccount = accountsList.find(acc => 
            acc.name === 'My Tutorial Account' || acc.name === 'My Tutorial'
        );

        if (tutorialAccount && (tutorialAccount._id || tutorialAccount.id)) {
            const accountId = tutorialAccount._id || tutorialAccount.id;
            try {
                await deleteAccount(accountId);
                console.log('✅ Tutorial account deleted:', accountId);
            } catch (error) {
                console.error('Error deleting tutorial account:', error);
            }
        }

        const budgets = await getBudgets();
        const budgetsList = Array.isArray(budgets) ? budgets : (budgets.budgets || []);
        const tutorialBudgets = budgetsList.filter(budget => 
            budget.name === 'My Tutorial Budget' || budget.name === 'My Tutorial B'
        );

        for (const budget of tutorialBudgets) {
            if (budget._id || budget.id) {
                const budgetId = budget._id || budget.id;
                try {
                    await deleteBudget(budgetId, true); 
                    console.log('✅ Tutorial budget deleted:', budgetId);
                } catch (error) {
                    console.error('Error deleting tutorial budget:', error);
                }
            }
        }

        window.dispatchEvent(new Event('accountUpdated'));
        window.dispatchEvent(new Event('budgetUpdated'));
    } catch (error) {
        console.error('Error resetting tutorial data:', error);
    }
};

export const checkFirstTimeUser = () => {
    const completeTourDone = getTutorialData('completeTourCompleted');
    const currentPath = window.location.pathname;

    if (!completeTourDone && currentPath === '/dashboard') {
        setTimeout(() => {
            
            const stillNotCompleted = !getTutorialData('completeTourCompleted');
            if (stillNotCompleted && window.location.pathname === '/dashboard') {
                startCompleteTour();
            }
        }, 1000);
    }
};

const navigateTo = (path) => {
    if (navigateFunction) {
        navigateFunction(path);
    } else {
        window.location.href = path;
    }
};

const setReactInputValue = (input, value) => {
    if (!input) return;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value);
    } else {
        input.value = value;
    }

    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    input.dispatchEvent(inputEvent);

    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    input.dispatchEvent(changeEvent);

    const reactInternalInstanceKey = Object.keys(input).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));
    if (reactInternalInstanceKey) {
        const reactInternalInstance = input[reactInternalInstanceKey];
        if (reactInternalInstance) {
            const props = reactInternalInstance.memoizedProps || reactInternalInstance.pendingProps;
            if (props && props.onChange) {
                const syntheticEvent = {
                    target: input,
                    currentTarget: input,
                    bubbles: true,
                    cancelable: true,
                    defaultPrevented: false,
                    eventPhase: 2,
                    isTrusted: false,
                    nativeEvent: inputEvent,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    type: 'change',
                    timeStamp: Date.now()
                };
                try {
                    props.onChange(syntheticEvent);
                } catch (e) {
                    console.log('Could not trigger React onChange directly');
                }
            }
        }
    }
};

const addOverlayClickHandler = (driverObj) => {
    setTimeout(() => {
        const overlay = document.querySelector('.driver-overlay');
        const highlightedElement = document.querySelector('.driver-highlighted-element');
        
        if (overlay) {
            overlay.style.cursor = 'pointer';
            overlay.onclick = (e) => {
                const clickedElement = e.target;
                const isClickOnHighlighted = highlightedElement && (
                    clickedElement === highlightedElement ||
                    highlightedElement.contains(clickedElement) ||
                    clickedElement.closest('.driver-highlighted-element')
                );
                
                if (e.target === overlay && !isClickOnHighlighted) {
                    driverObj.moveNext();
                }
            };
            
            overlay.style.pointerEvents = 'auto';
        }
        
        if (highlightedElement) {
            highlightedElement.style.pointerEvents = 'auto';
            highlightedElement.style.zIndex = '99999';
            
            const isFloatingButton = highlightedElement.id === 'add-budget-button' || 
                                     highlightedElement.id === 'add-first-account-button' ||
                                     highlightedElement.id === 'add-transaction-button';
            if (!isFloatingButton) {
                highlightedElement.style.position = 'relative';
            }

            const buttons = highlightedElement.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.style.pointerEvents = 'auto';
                btn.style.zIndex = '100000';
                btn.style.cursor = 'pointer';
            });
        }
    }, 100);
};

const waitForInput = (inputSelector, driverObj, nextStep) => {
    
    let attempts = 0;
    let isProgrammatic = false; 
    const waitForElement = () => {
        const input = document.querySelector(inputSelector);
        if (input) {
            
            const initialValue = input.value;

            const checkValue = (e) => {
                
                if (e && !e.isTrusted) {
                    return;
                }
                
                if (input.value && input.value.trim() && input.value !== initialValue) {
                    nextStep();
                }
            };

            input.addEventListener('input', checkValue, { once: true });
            input.addEventListener('blur', checkValue, { once: true });
        } else if (attempts < 20) {
            attempts++;
            setTimeout(waitForElement, 100);
        }
    };
    waitForElement();
};

const waitForElement = (selector, callback, maxAttempts = 20) => {
    let attempts = 0;
    const check = () => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(check, 200);
        }
    };
    check();
};

const waitForClick = (selector, driverObj, nextStep) => {
    waitForElement(selector, (element) => {
        element.style.pointerEvents = 'auto';
        element.style.zIndex = '100000';
        element.style.cursor = 'pointer';
        
        const handleClick = (e) => {
            e.stopPropagation();
            element.removeEventListener('click', handleClick, true);
            nextStep();
        };
        element.addEventListener('click', handleClick, true);
    });
};

const waitForSuccessModalToClose = (callback) => {
    
    setTimeout(() => {
        let attempts = 0;
        const maxAttempts = 150; 
        
        const checkModal = () => {

            let modalVisible = false;

            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                const style = window.getComputedStyle(el);
                const zIndex = style.zIndex || el.style.zIndex;

                if (el.classList && el.classList.contains('backdrop-blur-sm') && 
                    (zIndex === '9999' || zIndex === 9999)) {
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        modalVisible = true;
                        break;
                    }
                }

                if (el.textContent && el.textContent.includes('Success!') && 
                    (el.textContent.includes('has been created successfully') ||
                     el.textContent.includes('budget') ||
                     el.textContent.includes('account'))) {
                    if (style.display !== 'none' && style.visibility !== 'hidden' &&
                        style.opacity !== '0') {
                        modalVisible = true;
                        break;
                    }
                }
            }

            if (!modalVisible) {
                
                setTimeout(() => {
                    callback();
                }, 300);
            } else if (attempts < maxAttempts) {
                
                attempts++;
                setTimeout(checkModal, 100);
            } else {
                
                console.warn('Success modal still visible after waiting, proceeding anyway');
                callback();
            }
        };
        
        checkModal();
    }, 300);
};

export const startCompleteTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            { popover: { title: '👋 Welcome to TrackIT!', description: 'Welcome to your personal expense tracker! Let\'s take a quick tour of the dashboard. Click anywhere to continue!' } },
            { element: '#stat-cards', popover: { title: '📊 Dashboard Overview', description: 'This is your financial dashboard. Here you can see your Total Balance, Total Expenses, and Total Budget at a glance. Click anywhere to continue.' } },
            { element: '#ai-insights', popover: { title: '🤖 AI Insights', description: 'Get personalized financial advice powered by AI! This section provides smart insights about your spending habits. Click anywhere to continue.' } },
            { element: '#sidebar-item-accounts', popover: { title: '🏦 Ready to Create Your First Account?', description: 'Now let\'s create your first account! Click this menu item to go to the Accounts page.', side: 'right', onNextClick: () => { 
                setTutorialData('completeTourStep', 'accounts'); 
                driverObj.destroy(); 
                navigateTo('/accounts'); 
                
                setTimeout(() => {
                    const accountsTourCompleted = getTutorialData('accountsTourCompleted');
                    const currentPath = window.location.pathname;
                    
                    if (currentPath === '/accounts' && !accountsTourCompleted) {
                        console.log('Starting accounts tour from dashboard navigation');
                        startAccountsTour();
                    } else {
                        
                        setTimeout(() => {
                            if (window.location.pathname === '/accounts' && !getTutorialData('accountsTourCompleted')) {
                                console.log('Starting accounts tour after retry');
                                startAccountsTour();
                            }
                        }, 1000);
                    }
                }, 800);
            } } }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'accounts');
        }
    });
    driverObj.drive();
};

export const startAccountsTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true, 
        onPopoverRender: () => {
            addOverlayClickHandler(driverObj);
            
        },
        onDestroyed: () => {
            
            const modal = document.querySelector('div[id*="backdrop"]');
            const btn = document.querySelector('#add-first-account-button');

            if (!modal || modal.offsetParent === null) {
                if (btn) {
                    
                    btn.click();

                    let attempts = 0;
                    const checkModal = () => {
                        const modalCheck = document.querySelector('div[id*="backdrop"]');
                        if (modalCheck && modalCheck.offsetParent !== null) {
                            
                            startAccountFormTour();
                        } else if (attempts < 5) {
                            attempts++;
                            setTimeout(checkModal, 10);
                        } else {
                            
                            startAccountFormTour();
                        }
                    };
                    checkModal();
                }
            } else {
                
                startAccountFormTour();
            }
        },
        steps: [
            { 
                popover: { 
                    title: '🏦 Welcome to Accounts Page', 
                    description: 'Welcome to the Accounts page! Here you can manage all your money accounts. Let\'s create your first real account together. Click anywhere to continue!' 
                } 
            },
            { 
                element: '#add-first-account-button', 
                popover: { 
                    title: '➕ Click to Add Account', 
                    description: 'Click the green "Add Your First Account" button below, or click "Done" to auto-open the modal. The tutorial will automatically continue.',
                    onPopoverRender: () => {
                        const btn = document.querySelector('#add-first-account-button');
                        if (btn) {
                                
                                btn.style.pointerEvents = 'auto';
                                btn.style.zIndex = '100000';
                                
                                btn.style.cursor = 'pointer';
                                
                                let clicked = false;
                                const handleClick = (e) => {
                                    if (clicked) return;
                                    clicked = true;

                                    btn.style.zIndex = '1';

                                    btn.removeEventListener('click', handleClick, false);

                                    let attempts = 0;
                                    const checkModal = () => {
                                        const modal = document.querySelector('div[id*="backdrop"]');
                                        if (modal && modal.offsetParent !== null) {
                                            
                                            driverObj.destroy();
                                            startAccountFormTour();
                                        } else if (attempts < 5) {
                                            attempts++;
                                            setTimeout(checkModal, 10);
                                        } else {
                                            
                                            driverObj.destroy();
                                            startAccountFormTour();
                                        }
                                    };
                                    
                                    checkModal();
                                };
                                
                                btn.addEventListener('click', handleClick, false);
                            }
                    }
                } 
            }
        ]
    });
    driverObj.drive();
};

const startAccountFormTour = () => {
    document.body.classList.add('tutorial-active');

    const btn = document.querySelector('#add-first-account-button');
    if (btn) {
        btn.style.zIndex = '1';
    }

    const formDriverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => {
            addOverlayClickHandler(formDriverObj);
            setTimeout(() => {
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    popover.style.setProperty('z-index', '99999', 'important');
                    
                    popover.style.setProperty('pointer-events', 'auto', 'important');
                }
                const overlay = document.querySelector('.driver-overlay');
                if (overlay) {
                    overlay.style.setProperty('z-index', '99998', 'important');
                    overlay.style.setProperty('pointer-events', 'auto', 'important');
                    overlay.style.cursor = 'pointer';
                }
            }, 50);
        },
        onHighlightStarted: (element, step) => {
            
            if (step && step.index === 1) {
                const amountInput = document.querySelector('#account-amount-input');
                if (!amountInput || amountInput.offsetParent === null) {
                    console.warn('Step 3 element not found when highlighting, waiting...');
                    
                    let attempts = 0;
                    const waitForElement = () => {
                        const input = document.querySelector('#account-amount-input');
                        if (input && input.offsetParent !== null) {
                            
                            setTimeout(() => {
                                if (formDriverObj && formDriverObj.highlight) {
                                    formDriverObj.highlight(step);
                                }
                            }, 100);
                        } else if (attempts < 20) {
                            attempts++;
                            setTimeout(waitForElement, 100);
                        }
                    };
                    waitForElement();
                }
            }
            
            if (step && step.index === 3) {
                const saveBtn = document.querySelector('#account-save-button');
                if (!saveBtn || saveBtn.offsetParent === null) {
                    console.warn('Step 5 element not found when highlighting, waiting...');
                    
                    let attempts = 0;
                    const waitForElement = () => {
                        const btn = document.querySelector('#account-save-button');
                        if (btn && btn.offsetParent !== null) {
                            
                            setTimeout(() => {
                                if (formDriverObj && formDriverObj.highlight) {
                                    formDriverObj.highlight(step);
                                }
                            }, 100);
                        } else if (attempts < 20) {
                            attempts++;
                            setTimeout(waitForElement, 100);
                        }
                    };
                    waitForElement();
                }
            }
        },
        onDestroyed: () => {
            document.body.classList.remove('tutorial-active');
        },
        steps: [
            {
                element: '#account-name-input',
                popover: {
                    title: '📝 Step 2: Account Name',
                    description: 'Type a name for your account, or click Next to auto-fill.',
                    onPopoverRender: () => {

                        const input = document.querySelector('#account-name-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            waitForInput('#account-name-input', formDriverObj, () => {

                                let attempts = 0;
                                const checkAndMove = () => {
                                    const amountInput = document.querySelector('#account-amount-input');
                                    if (amountInput && amountInput.offsetParent !== null && 
                                        amountInput.offsetWidth > 0 && amountInput.offsetHeight > 0) {
                                        
                                        setTimeout(() => {
                                            formDriverObj.moveNext();
                                        }, 200);
                                    } else if (attempts < 50) {
                                        attempts++;
                                        setTimeout(checkAndMove, 100);
                                    } else {
                                        console.warn('Step 3 element not found after waiting, proceeding anyway');
                                        formDriverObj.moveNext();
                                    }
                                };
                                checkAndMove();
                            });
                        }
                        
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#account-name-input');
                        
                        if (input && !input.value.trim()) {
                            setReactInputValue(input, 'My Tutorial Account');
                            
                            setTimeout(() => {
                                proceedToStep3();
                            }, 100);
                        } else {
                            
                            proceedToStep3();
                        }
                        
                        function proceedToStep3() {

                            let attempts = 0;
                            const checkAndMove = () => {
                                const amountInput = document.querySelector('#account-amount-input');
                                if (amountInput && amountInput.offsetParent !== null && 
                                    amountInput.offsetWidth > 0 && amountInput.offsetHeight > 0) {

                                    setTimeout(() => {
                                        formDriverObj.moveNext();
                                    }, 300);
                                } else if (attempts < 50) {
                                    
                                    attempts++;
                                    setTimeout(checkAndMove, 100);
                                } else {
                                    
                                    console.warn('Step 3 element not found after waiting, proceeding anyway');
                                    formDriverObj.moveNext();
                                }
                            };
                            checkAndMove();
                        }
                    }
                }
            },
            {
                element: '#account-amount-input',
                popover: {
                    title: '💵 Step 3: Initial Balance',
                    description: 'Enter your starting balance, or click Next to auto-fill with 2000.',
                    onHighlightStarted: (element) => {
                        
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    },
                    onPopoverRender: () => {
                        
                        const setupStep = () => {
                            const input = document.querySelector('#account-amount-input');
                            if (input && input.offsetParent !== null) {

                                if (!input.value || input.value.trim() === '') {
                                    waitForInput('#account-amount-input', formDriverObj, () => {
                                        formDriverObj.moveNext();
                                    });
                                }

                            } else {
                                
                                setTimeout(setupStep, 100);
                            }
                        };
                        setupStep();
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#account-amount-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            setReactInputValue(input, '2000');
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#account-icons-section',
                popover: {
                    title: '🎨 Step 4: Choose an Icon',
                    description: 'Click any icon to select it, or click Next to auto-select.',
                    onPopoverRender: () => {

                    },
                    onNextClick: () => {
                        
                        const firstIcon = document.querySelector('#account-icons-section button');
                        if (firstIcon) {
                            
                            firstIcon.click();
                        }

                        setTimeout(() => {
                            let attempts = 0;
                            const checkAndMove = () => {
                                const saveBtn = document.querySelector('#account-save-button');
                                if (saveBtn && saveBtn.offsetParent !== null && 
                                    saveBtn.offsetWidth > 0 && saveBtn.offsetHeight > 0) {

                                    setTimeout(() => {
                                        formDriverObj.moveNext();
                                    }, 300);
                                } else if (attempts < 50) {
                                    attempts++;
                                    setTimeout(checkAndMove, 100);
                                } else {
                                    console.warn('Step 5 element not found after waiting, proceeding anyway');
                                    formDriverObj.moveNext();
                                }
                            };
                            checkAndMove();
                        }, 300);
                    }
                }
            },
            {
                element: '#account-save-button',
                popover: {
                    title: '✅ Step 5: Save Your Account',
                    description: 'Perfect! Now click the green "Add" button to save your account. The account will be created and displayed on this page!',
                    onHighlightStarted: (element) => {
                        
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    },
                    onPopoverRender: () => {
                        
                        const setupStep = () => {
                            const btn = document.querySelector('#account-save-button');
                            if (btn && btn.offsetParent !== null) {
                                
                                const handleClick = () => {
                                    btn.removeEventListener('click', handleClick);
                                    formDriverObj.destroy();
                                    
                                    setTutorialData('accountsTourCompleted', 'true');
                                    
                                    removeTutorialData('completeTourStep');
                                    
                                    waitForSuccessModalToClose(() => {
                                        startAccountPageExplanation();
                                    });
                                };
                                btn.addEventListener('click', handleClick);
                            } else {
                                
                                setTimeout(setupStep, 100);
                            }
                        };
                        setupStep();
                    },
                    onNextClick: () => {
                        
                        const btn = document.querySelector('#account-save-button');
                        if (btn) {
                            btn.click();
                        }
                    }
                }
            }
        ]
    });

    formDriverObj.drive();
};

const startAccountPageExplanation = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            { 
                popover: { 
                    title: '🎉 Account Created Successfully!', 
                    description: 'Great! Your account has been created and saved. You can see it displayed in the accounts list below. Click anywhere to continue!' 
                } 
            },
            { 
                element: '.space-y-3, .space-y-4', 
                popover: { 
                    title: '📋 Your Accounts List', 
                    description: 'Here you can see all your accounts. Each account card shows the account name, balance, and icon. You can edit, delete, or toggle accounts on/off. Click anywhere to continue!' 
                } 
            },
            { 
                element: '#sidebar-item-budget', 
                popover: { 
                    title: '💰 Ready to Create a Budget?', 
                    description: 'Now let\'s create a budget using the account you just created! Click this menu item to go to the Budget page.', 
                    side: 'right',
                    onNextClick: () => { 
                        setTutorialData('completeTourStep', 'budget'); 
                        driverObj.destroy(); 
                        navigateTo('/budget'); 
                    } 
                } 
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'budget');
        }
    });
    driverObj.drive();
};

export const startBudgetTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true, 
        onPopoverRender: () => {
            addOverlayClickHandler(driverObj);
            
        },
        steps: [
            { popover: { title: '💰 Welcome to Budget Page', description: 'Welcome to the Budget page! Here you can create and manage budgets to track your spending. Let\'s create your first budget using the account you just created. Click anywhere to continue!' } },
            { 
                element: '#add-budget-button', 
                popover: { 
                    title: '➕ Click to Add Budget', 
                    description: 'Click the green floating button to create a new budget. The tutorial will automatically continue.',
                    onPopoverRender: () => {
                        const btn = document.querySelector('#add-budget-button');
                        if (btn) {

                                btn.style.pointerEvents = 'auto';
                                btn.style.zIndex = '100000';
                                
                                btn.style.cursor = 'pointer';
                                
                                let clicked = false;
                                const handleClick = (e) => {
                                    if (clicked) return;
                                    clicked = true;

                                    btn.style.zIndex = '40';

                                    btn.removeEventListener('click', handleClick, false);

                                    let attempts = 0;
                                    const checkModal = () => {
                                        const modal = document.querySelector('div[id*="backdrop"]');
                                        if (modal && modal.offsetParent !== null) {
                                            
                                            driverObj.destroy();
                                            startBudgetFormTour();
                                        } else if (attempts < 5) {
                                            attempts++;
                                            setTimeout(checkModal, 10);
                                        } else {
                                            
                                            driverObj.destroy();
                                            startBudgetFormTour();
                                        }
                                    };
                                    
                                    checkModal();
                                };
                                
                                btn.addEventListener('click', handleClick, false);
                            }
                    },
                    onNextClick: () => {
                        
                        const btn = document.querySelector('#add-budget-button');
                        if (btn) {
                            btn.click();
                        }
                    }
                } 
            }
        ]
    });
    driverObj.drive();
};

const startBudgetFormTour = () => {
    document.body.classList.add('tutorial-active');

    let step5AutoAdvanceBlocked = false;

    const formDriverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => {
            addOverlayClickHandler(formDriverObj);
            setTimeout(() => {
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    popover.style.setProperty('z-index', '99999', 'important');
                    
                    popover.style.setProperty('pointer-events', 'auto', 'important');
                }
                const overlay = document.querySelector('.driver-overlay');
                if (overlay) {
                    overlay.style.setProperty('z-index', '99998', 'important');
                    overlay.style.setProperty('pointer-events', 'auto', 'important');
                    overlay.style.cursor = 'pointer';
                }

            }, 50);
        },
        onHighlightStarted: (element, step) => {
            
            if (step) {
                let selector = null;
                if (step.index === 0) selector = '#budget-name-input';
                else if (step.index === 1) selector = '#budget-total-amount-input';
                else if (step.index === 2) selector = '#budget-account-select';
                else if (step.index === 3) selector = '#budget-categories-section';
                else if (step.index === 4) selector = '#budget-category-amounts-section';
                else if (step.index === 5) selector = '#budget-save-button';
                
                if (selector) {
                    const el = document.querySelector(selector);
                    if (!el || el.offsetParent === null) {
                        console.warn(`Step ${step.index + 1} element not found, waiting...`);
                        let attempts = 0;
                        const waitForElement = () => {
                            const element = document.querySelector(selector);
                            if (element && element.offsetParent !== null && 
                                element.offsetWidth > 0 && element.offsetHeight > 0) {
                                
                                if (step.index === 4) {
                                    const inputs = element.querySelectorAll('input[type="number"]');
                                    if (inputs.length >= 2) {
                                        let visibleInputs = 0;
                                        inputs.forEach(input => {
                                            if (input.offsetParent !== null && input.offsetWidth > 0 && input.offsetHeight > 0) {
                                                visibleInputs++;
                                            }
                                        });
                                        if (visibleInputs >= 2) {
                                            setTimeout(() => {
                                                if (formDriverObj && formDriverObj.highlight) {
                                                    formDriverObj.highlight(step);
                                                }
                                            }, 200);
                                        } else if (attempts < 50) {
                                            attempts++;
                                            setTimeout(waitForElement, 100);
                                        } else {
                                            
                                            setTimeout(() => {
                                                if (formDriverObj && formDriverObj.highlight) {
                                                    formDriverObj.highlight(step);
                                                }
                                            }, 200);
                                        }
                                    } else if (attempts < 50) {
                                        attempts++;
                                        setTimeout(waitForElement, 100);
                                    } else {
                                        
                                        setTimeout(() => {
                                            if (formDriverObj && formDriverObj.highlight) {
                                                formDriverObj.highlight(step);
                                            }
                                        }, 200);
                                    }
                                } else {
                                    
                                    setTimeout(() => {
                                        if (formDriverObj && formDriverObj.highlight) {
                                            formDriverObj.highlight(step);
                                        }
                                    }, 200);
                                }
                            } else if (attempts < 50) {
                                attempts++;
                                setTimeout(waitForElement, 100);
                            } else {
                                
                                console.warn(`Step ${step.index + 1} element still not found after waiting, attempting highlight anyway`);
                                if (formDriverObj && formDriverObj.highlight) {
                                    setTimeout(() => {
                                        formDriverObj.highlight(step);
                                    }, 200);
                                }
                            }
                        };
                        waitForElement();
                    } else {
                        
                        if (el.offsetWidth === 0 || el.offsetHeight === 0) {
                            console.warn(`Step ${step.index + 1} element has zero dimensions, waiting...`);
                            let attempts = 0;
                            const waitForDimensions = () => {
                                const element = document.querySelector(selector);
                                if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
                                    
                                    if (step.index === 4) {
                                        const inputs = element.querySelectorAll('input[type="number"]');
                                        if (inputs.length >= 2) {
                                            let visibleInputs = 0;
                                            inputs.forEach(input => {
                                                if (input.offsetParent !== null && input.offsetWidth > 0 && input.offsetHeight > 0) {
                                                    visibleInputs++;
                                                }
                                            });
                                            if (visibleInputs >= 2) {
                                                setTimeout(() => {
                                                    if (formDriverObj && formDriverObj.highlight) {
                                                        formDriverObj.highlight(step);
                                                    }
                                                }, 200);
                                            } else if (attempts < 30) {
                                                attempts++;
                                                setTimeout(waitForDimensions, 100);
                                            }
                                        } else if (attempts < 30) {
                                            attempts++;
                                            setTimeout(waitForDimensions, 100);
                                        }
                                    } else {
                                        setTimeout(() => {
                                            if (formDriverObj && formDriverObj.highlight) {
                                                formDriverObj.highlight(step);
                                            }
                                        }, 200);
                                    }
                                } else if (attempts < 30) {
                                    attempts++;
                                    setTimeout(waitForDimensions, 100);
                                }
                            };
                            waitForDimensions();
                        } else if (step.index === 4) {
                            
                            const inputs = el.querySelectorAll('input[type="number"]');
                            if (inputs.length < 2) {
                                let attempts = 0;
                                const waitForInputs = () => {
                                    const element = document.querySelector(selector);
                                    const inputs = element ? element.querySelectorAll('input[type="number"]') : [];
                                    if (inputs.length >= 2) {
                                        let visibleInputs = 0;
                                        inputs.forEach(input => {
                                            if (input.offsetParent !== null && input.offsetWidth > 0 && input.offsetHeight > 0) {
                                                visibleInputs++;
                                            }
                                        });
                                        if (visibleInputs >= 2) {
                                            
                                        } else if (attempts < 30) {
                                            attempts++;
                                            setTimeout(waitForInputs, 100);
                                        }
                                    } else if (attempts < 30) {
                                        attempts++;
                                        setTimeout(waitForInputs, 100);
                                    }
                                };
                                waitForInputs();
                            }
                        }
                    }
                }
            }
        },
        onDestroyed: () => {
            document.body.classList.remove('tutorial-active');
        },
        steps: [
            {
                element: '#budget-name-input',
                popover: {
                    title: '📝 Step 1: Budget Name',
                    description: 'Give your budget a name, or click Next to auto-fill.',
                    onPopoverRender: () => {
                        
                        const input = document.querySelector('#budget-name-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            waitForInput('#budget-name-input', formDriverObj, () => {
                                
                                let attempts = 0;
                                const checkAndMove = () => {
                                    const amountInput = document.querySelector('#budget-total-amount-input');
                                    if (amountInput && amountInput.offsetParent !== null && 
                                        amountInput.offsetWidth > 0 && amountInput.offsetHeight > 0) {
                                        setTimeout(() => {
                                            formDriverObj.moveNext();
                                        }, 200);
                                    } else if (attempts < 50) {
                                        attempts++;
                                        setTimeout(checkAndMove, 100);
                                    } else {
                                        formDriverObj.moveNext();
                                    }
                                };
                                checkAndMove();
                            });
                        }
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#budget-name-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            setReactInputValue(input, 'My Tutorial Budget');
                        }
                        
                        let attempts = 0;
                        const checkAndMove = () => {
                            const amountInput = document.querySelector('#budget-total-amount-input');
                            if (amountInput && amountInput.offsetParent !== null && 
                                amountInput.offsetWidth > 0 && amountInput.offsetHeight > 0) {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 200);
                            } else if (attempts < 50) {
                                attempts++;
                                setTimeout(checkAndMove, 100);
                            } else {
                                formDriverObj.moveNext();
                            }
                        };
                        checkAndMove();
                    }
                }
            },
            {
                element: '#budget-total-amount-input',
                popover: {
                    title: '💵 Step 2: Total Budget Amount',
                    description: 'Enter your total budget amount, or click Next to auto-fill with 2000.',
                    onPopoverRender: () => {
                        
                        const input = document.querySelector('#budget-total-amount-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            waitForInput('#budget-total-amount-input', formDriverObj, () => {
                                
                                let attempts = 0;
                                const checkAndMove = () => {
                                    const accountSelect = document.querySelector('#budget-account-select');
                                    if (accountSelect && accountSelect.offsetParent !== null && 
                                        accountSelect.offsetWidth > 0 && accountSelect.offsetHeight > 0) {
                                        setTimeout(() => {
                                            formDriverObj.moveNext();
                                        }, 200);
                                    } else if (attempts < 50) {
                                        attempts++;
                                        setTimeout(checkAndMove, 100);
                                    } else {
                                        formDriverObj.moveNext();
                                    }
                                };
                                checkAndMove();
                            });
                        }
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#budget-total-amount-input');
                        if (input && (!input.value || input.value.trim() === '')) {
                            setReactInputValue(input, '2000');
                        }
                        
                        let attempts = 0;
                        const checkAndMove = () => {
                            const accountSelect = document.querySelector('#budget-account-select');
                            if (accountSelect && accountSelect.offsetParent !== null && 
                                accountSelect.offsetWidth > 0 && accountSelect.offsetHeight > 0) {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 200);
                            } else if (attempts < 50) {
                                attempts++;
                                setTimeout(checkAndMove, 100);
                            } else {
                                formDriverObj.moveNext();
                            }
                        };
                        checkAndMove();
                    }
                }
            },
            {
                element: '#budget-account-select',
                popover: {
                    title: '🏦 Step 3: Select Account',
                    description: 'Choose the account you just created, or click Next to auto-select.',
                    onPopoverRender: () => {

                    },
                    onNextClick: () => {
                        const select = document.querySelector('#budget-account-select');
                        if (select && select.options.length > 0 && !select.value) {
                            
                            select.value = select.options[0].value;
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        
                        let attempts = 0;
                        const waitForStep4 = () => {
                            const step4Element = document.querySelector('#budget-categories-section');
                            if (step4Element && step4Element.offsetParent !== null && 
                                step4Element.offsetWidth > 0 && step4Element.offsetHeight > 0) {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 300);
                            } else if (attempts < 50) {
                                attempts++;
                                setTimeout(waitForStep4, 100);
                            } else {
                                
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 300);
                            }
                        };
                        waitForStep4();
                    }
                }
            },
            {
                element: '#budget-categories-section',
                popover: {
                    title: '📂 Step 4: Select Categories',
                    description: 'Click on categories to select them. We\'ll select Food and Transportation, or click Next to auto-select.',
                    onHighlightStarted: (element) => {
                        
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            
                            let attempts = 0;
                            const waitForElement = () => {
                                const el = document.querySelector('#budget-categories-section');
                                if (el && el.offsetParent !== null && 
                                    el.offsetWidth > 0 && el.offsetHeight > 0) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                } else if (attempts < 30) {
                                    attempts++;
                                    setTimeout(waitForElement, 100);
                                }
                            };
                            waitForElement();
                        }
                    },
                    onPopoverRender: () => {
                        
                        let attempts = 0;
                        const checkElement = () => {
                            const element = document.querySelector('#budget-categories-section');
                            if (element && element.offsetParent !== null && 
                                element.offsetWidth > 0 && element.offsetHeight > 0) {
                                
                                console.log('Step 4 element is ready');
                            } else if (attempts < 30) {
                                attempts++;
                                console.warn(`Step 4 element not ready (attempt ${attempts}), waiting...`);
                                setTimeout(checkElement, 100);
                            } else {
                                console.error('Step 4 element not found after waiting');
                            }
                        };
                        checkElement();

                    },
                    onNextClick: () => {
                        
                        const categoryButtons = document.querySelectorAll('#budget-categories-section button');
                        let foodSelected = false;
                        let transportationSelected = false;
                        
                        categoryButtons.forEach(btn => {
                            const text = btn.textContent.trim();
                            const isSelected = btn.classList.contains('bg-green-500');
                            
                            if (!foodSelected && (text === 'Food' || text.includes('Food'))) {
                                if (!isSelected) {
                                    
                                    setTimeout(() => {
                                        btn.click();
                                    }, 50);
                                }
                                foodSelected = true;
                            } else if (!transportationSelected && (text === 'Transportation' || text.includes('Transportation'))) {
                                if (!isSelected) {
                                    
                                    setTimeout(() => {
                                        btn.click();
                                    }, 100);
                                }
                                transportationSelected = true;
                            }
                        });

                        if (!foodSelected || !transportationSelected) {
                            categoryButtons.forEach(btn => {
                                const text = btn.textContent.trim();
                                const isSelected = btn.classList.contains('bg-green-500');
                                if (!foodSelected && text.toLowerCase().includes('food') && !isSelected) {
                                    setTimeout(() => {
                                        btn.click();
                                    }, 50);
                                    foodSelected = true;
                                } else if (!transportationSelected && text.toLowerCase().includes('transportation') && !isSelected) {
                                    setTimeout(() => {
                                        btn.click();
                                    }, 100);
                                    transportationSelected = true;
                                }
                            });
                        }

                        setTimeout(() => {
                            
                            let attempts = 0;
                            const checkAndMove = () => {
                                const amountsSection = document.querySelector('#budget-category-amounts-section');
                                if (amountsSection && amountsSection.offsetParent !== null && 
                                    amountsSection.offsetWidth > 0 && amountsSection.offsetHeight > 0) {
                                    
                                    const categoryInputs = amountsSection.querySelectorAll('input[type="number"]');
                                    if (categoryInputs.length >= 2) {
                                        
                                        let visibleInputs = 0;
                                        categoryInputs.forEach(input => {
                                            if (input.offsetParent !== null && input.offsetWidth > 0 && input.offsetHeight > 0) {
                                                visibleInputs++;
                                            }
                                        });
                                        
                                        if (visibleInputs >= 2) {

                                            setTimeout(() => {
                                                formDriverObj.moveNext();
                                            }, 500);
                                        } else if (attempts < 50) {
                                            attempts++;
                                            setTimeout(checkAndMove, 100);
                                        } else {
                                            
                                            console.warn('Category inputs not fully visible, proceeding anyway');
                                            setTimeout(() => {
                                                formDriverObj.moveNext();
                                            }, 500);
                                        }
                                    } else if (attempts < 50) {
                                        attempts++;
                                        setTimeout(checkAndMove, 100);
                                    } else {
                                        
                                        console.warn('Category inputs not found, proceeding anyway');
                                        setTimeout(() => {
                                            formDriverObj.moveNext();
                                        }, 500);
                                    }
                                } else if (attempts < 50) {
                                    attempts++;
                                    setTimeout(checkAndMove, 100);
                                } else {
                                    
                                    console.warn('Category amounts section not found, proceeding anyway');
                                    setTimeout(() => {
                                        formDriverObj.moveNext();
                                    }, 500);
                                }
                            };
                            checkAndMove();
                        }, 600);
                    }
                }
            },
            {
                element: '#budget-category-amounts-section',
                popover: {
                    title: '💰 Step 5: Set Category Budgets',
                    description: 'Enter amounts for each selected category. We\'ll set 1000 for each, or click Next to auto-fill.',
                    onHighlightStarted: (element) => {
                        
                        if (element && element.offsetParent !== null && 
                            element.offsetWidth > 0 && element.offsetHeight > 0) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            
                            let attempts = 0;
                            const waitForElement = () => {
                                const el = document.querySelector('#budget-category-amounts-section');
                                if (el && el.offsetParent !== null && 
                                    el.offsetWidth > 0 && el.offsetHeight > 0) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                } else if (attempts < 50) {
                                    attempts++;
                                    setTimeout(waitForElement, 100);
                                }
                            };
                            waitForElement();
                        }
                    },
                    onPopoverRender: () => {
                        
                        let attempts = 0;
                        const checkElement = () => {
                            const element = document.querySelector('#budget-category-amounts-section');
                            if (element && element.offsetParent !== null && 
                                element.offsetWidth > 0 && element.offsetHeight > 0) {
                                
                                const inputs = element.querySelectorAll('input[type="number"]');
                                if (inputs.length >= 2) {
                                    
                                    console.log('Step 5 element is ready with', inputs.length, 'inputs');
                                } else if (attempts < 30) {
                                    attempts++;
                                    console.warn(`Step 5 inputs not ready (attempt ${attempts}), waiting...`);
                                    setTimeout(checkElement, 100);
                                }
                            } else if (attempts < 30) {
                                attempts++;
                                console.warn(`Step 5 element not ready (attempt ${attempts}), waiting...`);
                                setTimeout(checkElement, 100);
                            } else {
                                console.error('Step 5 element not found after waiting');
                            }
                        };
                        checkElement();

                    },
                    onNextClick: () => {
                        
                        const inputs = document.querySelectorAll('#budget-category-amounts-section input[type="number"]');
                        inputs.forEach(input => {
                            if (!input.value || parseFloat(input.value) <= 0) {
                                setReactInputValue(input, '1000');
                            }
                        });
                        
                        setTimeout(() => {
                            let attempts = 0;
                            const checkAndMove = () => {
                                const saveBtn = document.querySelector('#budget-save-button');
                                if (saveBtn && saveBtn.offsetParent !== null && 
                                    saveBtn.offsetWidth > 0 && saveBtn.offsetHeight > 0) {
                                    setTimeout(() => {
                                        formDriverObj.moveNext();
                                    }, 300);
                                } else if (attempts < 50) {
                                    attempts++;
                                    setTimeout(checkAndMove, 100);
                                } else {
                                    formDriverObj.moveNext();
                                }
                            };
                            checkAndMove();
                        }, 300);
                    }
                }
            },
            {
                element: '#budget-save-button',
                popover: {
                    title: '✅ Step 6: Create Your Budget',
                    description: 'Perfect! Now click the green "Add" button to create your budget. The budget will be saved and displayed on this page!',
                    onPopoverRender: () => {
                        const btn = document.querySelector('#budget-save-button');
                        if (btn) {
                            const handleClick = () => {
                                btn.removeEventListener('click', handleClick);
                                formDriverObj.destroy();
                                
                                waitForSuccessModalToClose(() => {
                                    startBudgetCardExplanation();
                                });
                            };
                            btn.addEventListener('click', handleClick);
                        }
                    },
                    onNextClick: () => {
                        
                        const btn = document.querySelector('#budget-save-button');
                        if (btn) {
                            btn.click();
                        }
                    }
                }
            }
        ]
    });

    formDriverObj.drive();
};

const startBudgetCardExplanation = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            { 
                popover: { 
                    title: '🎉 Budget Created Successfully!', 
                    description: 'Excellent! Your budget has been created and saved. You can see it displayed as a budget card below. Click anywhere to continue!' 
                } 
            },
            { 
                element: '.grid, .space-y-4, .space-y-6', 
                popover: { 
                    title: '📊 Your Budget Card', 
                    description: 'This is your budget card! It shows the budget name, total amount, account used, and categories with their allocated amounts. You can track your spending against each category. The card updates in real-time as you add expenses. Click anywhere to continue!' 
                } 
            },
            { 
                popover: { 
                    title: '🎓 Great Job!', 
                    description: 'You\'ve learned how to create accounts and budgets! Now let\'s explore the other pages in TrackIT. Click anywhere to continue!' 
                } 
            }
        ],
        onDestroyed: () => {
            
            startPageIntroductionTour();
        }
    });
    driverObj.drive();
};

const startPageIntroductionTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '🗺️ Explore Other Pages',
                    description: 'Great job creating your account and budget! You\'ve already learned about Dashboard, Accounts, and Budget. Now let\'s explore the other pages in TrackIT. Click anywhere to continue!'
                }
            },
            {
                element: '#sidebar-item-transaction',
                popover: {
                    title: '💸 Transactions Page',
                    description: 'The Transactions page lets you view all your income and expenses, and add new transactions. Let\'s check it out!',
                    side: 'right',
                    onNextClick: () => {
                        setTutorialData('completeTourStep', 'transaction');
                        driverObj.destroy();
                        navigateTo('/transaction');
                        setTimeout(() => {
                            startTransactionPageTour();
                        }, 500);
                    }
                }
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'transaction');
        }
    });
    driverObj.drive();
};

const startDashboardPageTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '📊 Dashboard Page',
                    description: 'Welcome to the Dashboard! Here you can see your financial overview at a glance. Click anywhere to continue!'
                }
            },
            {
                element: '#stat-cards',
                popover: {
                    title: '💰 Financial Summary',
                    description: 'These cards show your Total Balance, Total Expenses, and Total Budget. They update in real-time as you add transactions!'
                }
            },
            {
                element: '#ai-insights',
                popover: {
                    title: '🤖 AI Insights',
                    description: 'Get personalized financial advice powered by AI! This section provides smart insights about your spending habits.'
                }
            },
            {
                element: '#sidebar-item-transaction',
                popover: {
                    title: '💸 Transactions Page',
                    description: 'The Transactions page lets you view all your income and expenses, and add new transactions. Let\'s check it out!',
                    side: 'right',
                    onNextClick: () => {
                        setTutorialData('completeTourStep', 'transaction');
                        driverObj.destroy();
                        navigateTo('/transaction');
                        setTimeout(() => {
                            startTransactionPageTour();
                        }, 500);
                    }
                }
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'transaction');
        }
    });
    driverObj.drive();
};

const startTransactionPageTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '💸 Transactions Page',
                    description: 'This is where you can view all your transactions - both income and expenses. You can filter by date, category, and type. Click anywhere to continue!'
                }
            },
            {
                element: '#add-transaction-button',
                popover: {
                    title: '➕ Add Transactions',
                    description: 'Click this green button to quickly add new income or expense transactions. You already learned how to use this in the tutorial!'
                }
            },
            {
                element: '#sidebar-item-archive',
                popover: {
                    title: '📦 Archive',
                    description: 'The Archive page stores your completed or archived budgets. Useful for keeping track of past budgets!',
                    side: 'right',
                    onNextClick: () => {
                        setTutorialData('completeTourStep', 'archive');
                        driverObj.destroy();
                        navigateTo('/archive');
                        setTimeout(() => {
                            startArchivePageTour();
                        }, 500);
                    }
                }
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'archive');
        }
    });
    driverObj.drive();
};

const startArchivePageTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '📦 Archive Page',
                    description: 'The Archive stores your completed or archived budgets. You can view past budgets and their spending history here. Click anywhere to continue!'
                }
            },
            {
                element: '#sidebar-item-rewards',
                popover: {
                    title: '🏆 Rewards',
                    description: 'Earn badges and achievements as you use TrackIT! Track your progress and stay motivated with the Rewards page.',
                    side: 'right',
                    onNextClick: () => {
                        setTutorialData('completeTourStep', 'rewards');
                        driverObj.destroy();
                        navigateTo('/rewards');
                        setTimeout(() => {
                            startRewardsPageTour();
                        }, 500);
                    }
                }
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'rewards');
        }
    });
    driverObj.drive();
};

const startRewardsPageTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '🏆 Rewards Page',
                    description: 'Earn badges and achievements as you track your finances! Complete challenges to unlock new badges and stay motivated. Click anywhere to continue!'
                }
            },
            {
                element: '#sidebar-item-settings',
                popover: {
                    title: '⚙️ Settings',
                    description: 'The Settings page lets you customize your experience, manage your account, and reset your data. Let\'s check it out!',
                    side: 'right',
                    onNextClick: () => {
                        setTutorialData('completeTourStep', 'settings');
                        driverObj.destroy();
                        navigateTo('/settings');
                        setTimeout(() => {
                            startSettingsPageTour();
                        }, 500);
                    }
                }
            }
        ],
        onDestroyed: () => {
            const step = getTutorialData('completeTourStep');
            if (!step) setTutorialData('completeTourStep', 'settings');
        }
    });
    driverObj.drive();
};

const startSettingsPageTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            {
                popover: {
                    title: '⚙️ Settings Page',
                    description: 'In Settings, you can customize your currency, manage notifications, reset your data, and more. Click anywhere to continue!'
                }
            },
            {
                element: '#reset-data-button',
                popover: {
                    title: '🔄 Reset Data',
                    description: 'You can reset all your data here if needed. This will delete all accounts, budgets, and transactions.'
                }
            },
            {
                popover: {
                    title: '🎉 Tutorial Complete!',
                    description: 'Congratulations! You\'ve explored all the main pages in TrackIT:\n\n✅ Dashboard - Financial overview\n✅ Transactions - Add and view transactions\n✅ Budget - Create and manage budgets\n✅ Archive - View past budgets\n✅ Rewards - Earn badges\n✅ Accounts - Manage accounts\n✅ Settings - Customize your experience\n\nYou\'re all set to manage your finances! Happy tracking! 💚',
                    onNextClick: async () => {
                        
                        await resetTutorialData();
                        setTutorialData('completeTourCompleted', 'true');
                        removeTutorialData('completeTourStep');
                        driverObj.destroy();
                        navigateTo('/dashboard');
                    }
                }
            }
        ],
        onDestroyed: async () => {
            
            const wasCompleted = getTutorialData('completeTourCompleted');
            if (wasCompleted) {
                await resetTutorialData();
            }
            setTutorialData('completeTourCompleted', 'true');
            removeTutorialData('completeTourStep');
        }
    });
    driverObj.drive();
};

export const startTransactionTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => {
            addOverlayClickHandler(driverObj);
            setTimeout(() => {
                const btn = document.querySelector('#add-transaction-button');
                if (btn) {
                    btn.style.pointerEvents = 'auto';
                    btn.style.zIndex = '100000';
                    btn.style.position = 'relative';
                }
            }, 150);
        },
        steps: [
            { popover: { title: '💸 Transactions Page', description: 'Great! Your budget is saved! Now let\'s learn how to track expenses and income.' } },
            { 
                element: '#add-transaction-button', 
                popover: { 
                    title: '➕ Add Transaction', 
                    description: 'Click the green floating button to add an expense or income. The tutorial will automatically continue.',
                    onPopoverRender: () => {
                        setTimeout(() => {
                            const btn = document.querySelector('#add-transaction-button');
                            if (btn) {
                                btn.style.pointerEvents = 'auto';
                                btn.style.zIndex = '100000';
                                btn.style.position = 'relative';
                                btn.style.cursor = 'pointer';
                                
                            let clicked = false;
                            const handleClick = (e) => {
                                if (clicked) return;
                                clicked = true;
                                
                                e.stopPropagation();
                                btn.removeEventListener('click', handleClick, true);
                                
                                driverObj.destroy();
                                setTimeout(() => { startTransactionFormTour(); }, 600);
                            };
                                btn.addEventListener('click', handleClick, true);
                            }
                        }, 200);
                    }
                } 
            }
        ]
    });
    driverObj.drive();
};

const startTransactionFormTour = () => {
    document.body.classList.add('tutorial-active');

    const formDriverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => {
            addOverlayClickHandler(formDriverObj);
            setTimeout(() => {
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    popover.style.setProperty('z-index', '99999', 'important');
                    popover.style.setProperty('pointer-events', 'auto', 'important');
                }
                const overlay = document.querySelector('.driver-overlay');
                if (overlay) {
                    overlay.style.setProperty('z-index', '99998', 'important');
                    overlay.style.setProperty('pointer-events', 'auto', 'important');
                    overlay.style.cursor = 'pointer';
                }
            }, 50);
        },
        onDestroyed: () => {
            document.body.classList.remove('tutorial-active');
        },
        steps: [
            {
                element: '[data-budget-card="true"]',
                popover: {
                    title: '💸 Step 1: Select a Budget Card',
                    description: 'Click on a budget card to select it, or click Next to auto-select.',
                    onPopoverRender: () => {
                        waitForClick('[data-budget-card="true"]', formDriverObj, () => {
                            
                            waitForElement('#expense-categories-section', () => {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 500);
                            });
                        });
                    },
                    onNextClick: () => {
                        const firstCard = document.querySelector('[data-budget-card="true"]');
                        if (firstCard) {
                            firstCard.click();
                            waitForElement('#expense-categories-section', () => {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 500);
                            });
                        } else {
                            formDriverObj.moveNext();
                        }
                    }
                }
            },
            {
                element: '#expense-categories-section',
                popover: {
                    title: '📝 Step 2: Enter Expense Amount',
                    description: 'Enter an amount for one of the categories, or click Next to auto-fill.',
                    onPopoverRender: () => {
                        waitForElement('#expense-categories-section input[type="number"]', () => {
                            const checkAmount = () => {
                                const inputs = document.querySelectorAll('#expense-categories-section input[type="number"]');
                                for (let inp of inputs) {
                                    if (inp.value && parseFloat(inp.value) > 0) {
                                        formDriverObj.moveNext();
                                        return;
                                    }
                                }
                                setTimeout(checkAmount, 500);
                            };
                            const inputs = document.querySelectorAll('#expense-categories-section input[type="number"]');
                            inputs.forEach(inp => {
                                inp.addEventListener('input', () => {
                                    if (inp.value && parseFloat(inp.value) > 0) {
                                        formDriverObj.moveNext();
                                    }
                                }, { once: true });
                            });
                            setTimeout(checkAmount, 1000);
                        });
                    },
                    onNextClick: () => {
                        const inputs = document.querySelectorAll('#expense-categories-section input[type="number"]');
                        if (inputs.length > 0 && !inputs[0].value) {
                            inputs[0].value = '500';
                            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
                            inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#expense-categories-section',
                popover: {
                    title: '📅 Step 3: Select Date',
                    description: 'Select a date for your expense, or click Next to auto-fill.',
                    onPopoverRender: () => {
                        waitForElement('#expense-categories-section input[type="date"]', () => {
                            const checkDate = () => {
                                const dates = document.querySelectorAll('#expense-categories-section input[type="date"]');
                                for (let date of dates) {
                                    if (date.value) {
                                        formDriverObj.moveNext();
                                        return;
                                    }
                                }
                                setTimeout(checkDate, 500);
                            };
                            const dates = document.querySelectorAll('#expense-categories-section input[type="date"]');
                            dates.forEach(date => {
                                date.addEventListener('change', () => {
                                    if (date.value) {
                                        formDriverObj.moveNext();
                                    }
                                }, { once: true });
                            });
                            setTimeout(checkDate, 1000);
                        });
                    },
                    onNextClick: () => {
                        const dates = document.querySelectorAll('#expense-categories-section input[type="date"]');
                        if (dates.length > 0 && !dates[0].value) {
                            const today = new Date().toISOString().split('T')[0];
                            dates[0].value = today;
                            dates[0].dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#expense-submit-button',
                popover: {
                    title: '✅ Step 4: Save Expense',
                    description: 'Click "Add Expense" to save your expense transaction!',
                    onPopoverRender: () => {
                        waitForElement('#expense-submit-button', (btn) => {
                            btn.style.pointerEvents = 'auto';
                            btn.style.zIndex = '100000';
                            btn.style.cursor = 'pointer';
                            
                            const handleClick = (e) => {
                                e.stopPropagation();
                                btn.removeEventListener('click', handleClick, true);
                                formDriverObj.destroy();
                                
                                setTimeout(() => {
                                    const addBtn = document.querySelector('#add-transaction-button');
                                    if (addBtn) {
                                        addBtn.click();
                                        setTimeout(() => {
                                            startIncomeFormTour(() => {
                                                setTutorialData('completeTourStep', 'settings');
                                                navigateTo('/settings');
                                            });
                                        }, 600);
                                    } else {
                                        setTutorialData('completeTourStep', 'settings');
                                        navigateTo('/settings');
                                    }
                                }, 2000);
                            };
                            btn.addEventListener('click', handleClick, true);
                        });
                    }
                }
            }
        ]
    });

    formDriverObj.drive();
};

const startIncomeFormTour = (onComplete) => {
    document.body.classList.add('tutorial-active');

    const formDriverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: true,
        onPopoverRender: () => {
            addOverlayClickHandler(formDriverObj);
            setTimeout(() => {
                const popover = document.querySelector('.driver-popover');
                if (popover) {
                    popover.style.setProperty('z-index', '99999', 'important');
                    popover.style.setProperty('pointer-events', 'auto', 'important');
                }
                const overlay = document.querySelector('.driver-overlay');
                if (overlay) {
                    overlay.style.setProperty('z-index', '99998', 'important');
                    overlay.style.setProperty('pointer-events', 'auto', 'important');
                    overlay.style.cursor = 'pointer';
                }
            }, 50);
        },
        onDestroyed: () => {
            if (onComplete) onComplete();
        },
        steps: [
            {
                element: '#transaction-type-income-button',
                popover: {
                    title: '💰 Step 1: Switch to Income',
                    description: 'Click the "Income" button to switch to income mode, or click Next to auto-select.',
                    onPopoverRender: () => {
                        waitForElement('#transaction-type-income-button', (btn) => {
                            btn.style.pointerEvents = 'auto';
                            btn.style.zIndex = '100000';
                            btn.style.cursor = 'pointer';
                            
                            let clicked = false;
                            const handleClick = (e) => {
                                if (clicked) return;
                                clicked = true;
                                
                                e.stopPropagation();
                                btn.removeEventListener('click', handleClick, true);
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 500);
                            };
                            btn.addEventListener('click', handleClick, true);
                        });
                    },
                    onNextClick: () => {
                        const btn = document.querySelector('#transaction-type-income-button');
                        if (btn) {
                            btn.click();
                            setTimeout(() => {
                                formDriverObj.moveNext();
                            }, 500);
                        } else {
                            formDriverObj.moveNext();
                        }
                    }
                }
            },
            {
                element: '[data-account-card="true"]',
                popover: {
                    title: '🏦 Step 2: Select an Account',
                    description: 'Click on an account card to select it, or click Next to auto-select.',
                    onPopoverRender: () => {
                        waitForClick('[data-account-card="true"]', formDriverObj, () => {
                            waitForElement('#income-category-select', () => {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 500);
                            });
                        });
                    },
                    onNextClick: () => {
                        const firstCard = document.querySelector('[data-account-card="true"]');
                        if (firstCard) {
                            firstCard.click();
                            waitForElement('#income-category-select', () => {
                                setTimeout(() => {
                                    formDriverObj.moveNext();
                                }, 500);
                            });
                        } else {
                            formDriverObj.moveNext();
                        }
                    }
                }
            },
            {
                element: '#income-category-select',
                popover: {
                    title: '📂 Step 3: Select Income Category',
                    description: 'Select a category for your income, or click Next to auto-select.',
                    onPopoverRender: () => {
                        waitForElement('#income-category-select', (select) => {
                            const checkCategory = () => {
                                if (select.value) {
                                    formDriverObj.moveNext();
                                } else {
                                    setTimeout(checkCategory, 500);
                                }
                            };
                            select.addEventListener('change', () => {
                                if (select.value) {
                                    formDriverObj.moveNext();
                                }
                            }, { once: true });
                            setTimeout(checkCategory, 1000);
                        });
                    },
                    onNextClick: () => {
                        const select = document.querySelector('#income-category-select');
                        if (select && select.options.length > 1 && !select.value) {
                            select.value = select.options[1].value; 
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#income-amount-input',
                popover: {
                    title: '💵 Step 4: Enter Income Amount',
                    description: 'Enter the income amount, or click Next to auto-fill.',
                    onPopoverRender: () => {
                        waitForInput('#income-amount-input', formDriverObj, () => {
                            formDriverObj.moveNext();
                        });
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#income-amount-input');
                        if (input && !input.value) {
                            input.value = '2000';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#income-date-input',
                popover: {
                    title: '📅 Step 5: Select Date',
                    description: 'Select the date for this income, or click Next to auto-fill.',
                    onPopoverRender: () => {
                        waitForElement('#income-date-input', (input) => {
                            const checkDate = () => {
                                if (input.value) {
                                    formDriverObj.moveNext();
                                } else {
                                    setTimeout(checkDate, 500);
                                }
                            };
                            input.addEventListener('change', () => {
                                if (input.value) {
                                    formDriverObj.moveNext();
                                }
                            }, { once: true });
                            setTimeout(checkDate, 1000);
                        });
                    },
                    onNextClick: () => {
                        const input = document.querySelector('#income-date-input');
                        if (input && !input.value) {
                            const today = new Date().toISOString().split('T')[0];
                            input.value = today;
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        formDriverObj.moveNext();
                    }
                }
            },
            {
                element: '#income-submit-button',
                popover: {
                    title: '✅ Step 6: Save Income',
                    description: 'Click "Add Income" to save your income transaction!',
                    onPopoverRender: () => {
                        waitForElement('#income-submit-button', (btn) => {
                            btn.style.pointerEvents = 'auto';
                            btn.style.zIndex = '100000';
                            btn.style.cursor = 'pointer';
                            
                            const handleClick = (e) => {
                                e.stopPropagation();
                                btn.removeEventListener('click', handleClick, true);
                                formDriverObj.destroy();
                                if (onComplete) {
                                    setTimeout(() => onComplete(), 1500);
                                }
                            };
                            btn.addEventListener('click', handleClick, true);
                        });
                    }
                }
            }
        ]
    });

    formDriverObj.drive();
};

export const startRewardsTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            { popover: { title: '🎁 Rewards & Achievements', description: 'Track your badges and stay motivated!' } },
            { element: '#sidebar-item-settings', popover: { title: '⚙️ Final Stop: Settings', description: 'Let\'s check out Settings. Click this menu!', side: 'right', onNextClick: () => { setTutorialData('completeTourStep', 'settings'); driverObj.destroy(); navigateTo('/settings'); } } }
        ],
        onDestroyed: () => {
            setTutorialData('completeTourStep', 'settings');
        }
    });
    driverObj.drive();
};

export const startSettingsTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        showButtons: false,
        onPopoverRender: () => addOverlayClickHandler(driverObj),
        steps: [
            { popover: { title: '⚙️ Settings Page', description: 'Great job! You\'ve created accounts, budgets, and transactions. Now let\'s learn how to reset your data.' } },
            { 
                element: '#reset-data-button', 
                popover: { 
                    title: '🔄 Reset Data', 
                    description: 'Click "Reset Data" to clear all your tutorial data. This will delete all accounts, budgets, and transactions.',
                    onPopoverRender: () => {
                        const btn = document.querySelector('#reset-data-button');
                        if (btn) {
                            btn.style.pointerEvents = 'auto';
                            btn.style.zIndex = '100000';
                            btn.style.cursor = 'pointer';
                            
                            const handleClick = (e) => {
                                e.stopPropagation();
                                btn.removeEventListener('click', handleClick, true);
                                driverObj.destroy();
                            };
                            btn.addEventListener('click', handleClick, true);
                        }
                    }
                } 
            },
            { 
                popover: { 
                    title: '🎉 Congratulations!', 
                    description: 'You\'ve completed the complete TrackIT tutorial!\n\n✅ Created a real account (saved to database)\n✅ Created a real budget (saved to database)\n✅ Added expense transaction\n✅ Added income transaction\n✅ Learned to reset data\n\nYou\'re all set to manage your finances! 💚', 
                    onNextClick: () => { 
                        setTutorialData('completeTourCompleted', 'true'); 
                        removeTutorialData('completeTourStep'); 
                        driverObj.destroy(); 
                        navigateTo('/dashboard'); 
                    } 
                } 
            }
        ],
        onDestroyed: () => {
            setTutorialData('completeTourCompleted', 'true');
            removeTutorialData('completeTourStep');
        }
    });
    driverObj.drive();
};

export const startDashboardTour = () => {
    const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        steps: [
            { element: '#sidebar-nav', popover: { title: 'Navigation', description: 'Use the sidebar to navigate between pages.' } },
            { element: '#welcome-banner', popover: { title: 'Welcome!', description: 'Your personal finance dashboard.' } },
            { element: '#stat-cards', popover: { title: 'Key Stats', description: 'Track your Balance, Expenses, and Budget.' } },
            { element: '#sidebar-item-transaction', popover: { title: 'Transactions', description: 'View history and add new income or expenses.', side: 'right' } },
            { element: '#ai-insights', popover: { title: 'AI Insights', description: 'Get personalized financial advice!' } }
        ],
        onDestroyed: () => {
            setTutorialData('dashboardTourCompleted', 'true');
        }
    });
    driverObj.drive();
};

export const checkAndStartTour = () => {
    const completeTourDone = getTutorialData('completeTourCompleted');
    const tourStep = getTutorialData('completeTourStep');
    const currentPath = window.location.pathname;
    
    const accountsTourCompleted = getTutorialData('accountsTourCompleted');

    if (!completeTourDone) {
        setTimeout(() => {
            
            const currentTourStep = getTutorialData('completeTourStep');
            const currentPathCheck = window.location.pathname;
            const currentAccountsTourCompleted = getTutorialData('accountsTourCompleted');
            
            if (currentTourStep === 'accounts' && currentPathCheck === '/accounts' && !currentAccountsTourCompleted) {
                console.log('checkAndStartTour: Starting accounts tour');
                startAccountsTour();
            } else if (currentTourStep === 'budget' && currentPathCheck === '/budget') {
                startBudgetTour();
            } else if (currentTourStep === 'dashboard' && currentPathCheck === '/dashboard') {
                startDashboardPageTour();
            } else if (currentTourStep === 'transaction' && currentPathCheck === '/transaction') {
                startTransactionPageTour();
            } else if (currentTourStep === 'archive' && currentPathCheck === '/archive') {
                startArchivePageTour();
            } else if (currentTourStep === 'rewards' && currentPathCheck === '/rewards') {
                startRewardsPageTour();
            } else if (currentTourStep === 'settings' && currentPathCheck === '/settings') {
                startSettingsPageTour();
            } else if (currentPathCheck === '/dashboard' && !currentTourStep) {
                
                startCompleteTour();
            }
        }, 800);
    }
};

export const resetCompleteTour = () => {
    removeTutorialData('completeTourCompleted');
    removeTutorialData('completeTourStep');
    
    removeTutorialData('accountsTourCompleted');
    removeTutorialData('budgetTourCompleted');
    removeTutorialData('transactionTourCompleted');
    navigateTo('/dashboard');
    setTimeout(() => {
        startCompleteTour();
    }, 500);
};

export const resetDashboardTour = () => {
    removeTutorialData('dashboardTourCompleted');
    startDashboardTour();
};

export const startTour = startDashboardTour;
export const resetTour = resetCompleteTour;
