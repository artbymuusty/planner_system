(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/dateUtils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "getMonday",
    ()=>getMonday,
    "getWeekDates",
    ()=>getWeekDates,
    "isPast",
    ()=>isPast,
    "isToday",
    ()=>isToday
]);
function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
}
function formatDate(d) {
    return "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'));
}
function isToday(d) {
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}
function isPast(d) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    return check < today;
}
function getWeekDates(weekStart) {
    const dates = [];
    for(let i = 0; i < 7; i++){
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }
    return dates;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadModuleData",
    ()=>loadModuleData,
    "loadPlannerData",
    ()=>loadPlannerData,
    "saveModuleData",
    ()=>saveModuleData,
    "savePlannerData",
    ()=>savePlannerData
]);
const PLANNER_KEY = 'hackplanner';
const MODULES_KEY = 'hackplanner_modules';
function savePlannerData(events, user) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(PLANNER_KEY, JSON.stringify({
        events,
        user
    }));
}
function loadPlannerData() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(PLANNER_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            return {
                events: data.events || [],
                user: data.user || null
            };
        }
    } catch (e) {
        console.error('Load error:', e);
    }
    return {
        events: [],
        user: null
    };
}
function saveModuleData(modState) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(MODULES_KEY, JSON.stringify(modState));
}
function loadModuleData() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(MODULES_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error('Module load error:', e);
    }
    return {};
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePlannerState.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePlannerState",
    ()=>usePlannerState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function usePlannerState() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        currentWeekStart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMonday"])(new Date()),
        events: [],
        user: null,
        deleteMode: false,
        pendingDeleteId: null,
        pendingReaddEvent: null,
        pendingSplitEvent: null,
        selectedImportance: 'high'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePlannerState.useEffect": ()=>{
            const { events, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadPlannerData"])();
            setState({
                "usePlannerState.useEffect": (prev)=>({
                        ...prev,
                        events,
                        user
                    })
            }["usePlannerState.useEffect"]);
        }
    }["usePlannerState.useEffect"], []);
    const saveAndUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[saveAndUpdate]": (events, user)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePlannerData"])(events, user);
        }
    }["usePlannerState.useCallback[saveAndUpdate]"], []);
    const navigateWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[navigateWeek]": (dir)=>{
            setState({
                "usePlannerState.useCallback[navigateWeek]": (prev)=>{
                    const next = new Date(prev.currentWeekStart);
                    next.setDate(next.getDate() + dir * 7);
                    return {
                        ...prev,
                        currentWeekStart: next
                    };
                }
            }["usePlannerState.useCallback[navigateWeek]"]);
        }
    }["usePlannerState.useCallback[navigateWeek]"], []);
    const goToToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[goToToday]": ()=>{
            setState({
                "usePlannerState.useCallback[goToToday]": (prev)=>({
                        ...prev,
                        currentWeekStart: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMonday"])(new Date())
                    })
            }["usePlannerState.useCallback[goToToday]"]);
        }
    }["usePlannerState.useCallback[goToToday]"], []);
    const addEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[addEvent]": (event)=>{
            setState({
                "usePlannerState.useCallback[addEvent]": (prev)=>{
                    const events = [
                        ...prev.events,
                        event
                    ];
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events
                    };
                }
            }["usePlannerState.useCallback[addEvent]"]);
        }
    }["usePlannerState.useCallback[addEvent]"], [
        saveAndUpdate
    ]);
    const addEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[addEvents]": (newEvents)=>{
            setState({
                "usePlannerState.useCallback[addEvents]": (prev)=>{
                    const events = [
                        ...prev.events,
                        ...newEvents
                    ];
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events
                    };
                }
            }["usePlannerState.useCallback[addEvents]"]);
        }
    }["usePlannerState.useCallback[addEvents]"], [
        saveAndUpdate
    ]);
    const toggleComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[toggleComplete]": (id)=>{
            setState({
                "usePlannerState.useCallback[toggleComplete]": (prev)=>{
                    const events = prev.events.map({
                        "usePlannerState.useCallback[toggleComplete].events": (e)=>e.id === id ? {
                                ...e,
                                completed: !e.completed
                            } : e
                    }["usePlannerState.useCallback[toggleComplete].events"]);
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events
                    };
                }
            }["usePlannerState.useCallback[toggleComplete]"]);
        }
    }["usePlannerState.useCallback[toggleComplete]"], [
        saveAndUpdate
    ]);
    const deleteEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[deleteEvent]": (id)=>{
            setState({
                "usePlannerState.useCallback[deleteEvent]": (prev)=>{
                    const events = prev.events.filter({
                        "usePlannerState.useCallback[deleteEvent].events": (e)=>e.id !== id
                    }["usePlannerState.useCallback[deleteEvent].events"]);
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events,
                        pendingDeleteId: null,
                        deleteMode: false
                    };
                }
            }["usePlannerState.useCallback[deleteEvent]"]);
        }
    }["usePlannerState.useCallback[deleteEvent]"], [
        saveAndUpdate
    ]);
    const removeEventsByModule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[removeEventsByModule]": (moduleType, filter)=>{
            setState({
                "usePlannerState.useCallback[removeEventsByModule]": (prev)=>{
                    const events = prev.events.filter({
                        "usePlannerState.useCallback[removeEventsByModule].events": (e)=>{
                            if (e.moduleType !== moduleType) return true;
                            if (filter) return !filter(e);
                            return false;
                        }
                    }["usePlannerState.useCallback[removeEventsByModule].events"]);
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events
                    };
                }
            }["usePlannerState.useCallback[removeEventsByModule]"]);
        }
    }["usePlannerState.useCallback[removeEventsByModule]"], [
        saveAndUpdate
    ]);
    const postponeEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[postponeEvent]": (id, newDate, reason)=>{
            setState({
                "usePlannerState.useCallback[postponeEvent]": (prev)=>{
                    const events = prev.events.map({
                        "usePlannerState.useCallback[postponeEvent].events": (e)=>{
                            if (e.id !== id) return e;
                            return {
                                ...e,
                                postponeCount: (e.postponeCount || 0) + 1,
                                postponeHistory: [
                                    ...e.postponeHistory || [],
                                    {
                                        from: e.date,
                                        to: newDate,
                                        reason,
                                        timestamp: Date.now()
                                    }
                                ],
                                originalDate: e.originalDate || e.date,
                                date: newDate,
                                completed: false
                            };
                        }
                    }["usePlannerState.useCallback[postponeEvent].events"]);
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events,
                        pendingReaddEvent: null
                    };
                }
            }["usePlannerState.useCallback[postponeEvent]"]);
        }
    }["usePlannerState.useCallback[postponeEvent]"], [
        saveAndUpdate
    ]);
    const splitEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[splitEvent]": (originalId, subEvents)=>{
            setState({
                "usePlannerState.useCallback[splitEvent]": (prev)=>{
                    const events = [
                        ...prev.events.filter({
                            "usePlannerState.useCallback[splitEvent]": (e)=>e.id !== originalId
                        }["usePlannerState.useCallback[splitEvent]"]),
                        ...subEvents
                    ];
                    saveAndUpdate(events, prev.user);
                    return {
                        ...prev,
                        events,
                        pendingSplitEvent: null
                    };
                }
            }["usePlannerState.useCallback[splitEvent]"]);
        }
    }["usePlannerState.useCallback[splitEvent]"], [
        saveAndUpdate
    ]);
    const toggleDeleteMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[toggleDeleteMode]": ()=>{
            setState({
                "usePlannerState.useCallback[toggleDeleteMode]": (prev)=>({
                        ...prev,
                        deleteMode: !prev.deleteMode
                    })
            }["usePlannerState.useCallback[toggleDeleteMode]"]);
        }
    }["usePlannerState.useCallback[toggleDeleteMode]"], []);
    const setDeleteMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[setDeleteMode]": (val)=>{
            setState({
                "usePlannerState.useCallback[setDeleteMode]": (prev)=>({
                        ...prev,
                        deleteMode: val
                    })
            }["usePlannerState.useCallback[setDeleteMode]"]);
        }
    }["usePlannerState.useCallback[setDeleteMode]"], []);
    const setPendingDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[setPendingDelete]": (id)=>{
            setState({
                "usePlannerState.useCallback[setPendingDelete]": (prev)=>({
                        ...prev,
                        pendingDeleteId: id
                    })
            }["usePlannerState.useCallback[setPendingDelete]"]);
        }
    }["usePlannerState.useCallback[setPendingDelete]"], []);
    const setPendingReadd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[setPendingReadd]": (event)=>{
            setState({
                "usePlannerState.useCallback[setPendingReadd]": (prev)=>({
                        ...prev,
                        pendingReaddEvent: event
                    })
            }["usePlannerState.useCallback[setPendingReadd]"]);
        }
    }["usePlannerState.useCallback[setPendingReadd]"], []);
    const setPendingSplit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[setPendingSplit]": (event)=>{
            setState({
                "usePlannerState.useCallback[setPendingSplit]": (prev)=>({
                        ...prev,
                        pendingSplitEvent: event
                    })
            }["usePlannerState.useCallback[setPendingSplit]"]);
        }
    }["usePlannerState.useCallback[setPendingSplit]"], []);
    const setSelectedImportance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[setSelectedImportance]": (imp)=>{
            setState({
                "usePlannerState.useCallback[setSelectedImportance]": (prev)=>({
                        ...prev,
                        selectedImportance: imp
                    })
            }["usePlannerState.useCallback[setSelectedImportance]"]);
        }
    }["usePlannerState.useCallback[setSelectedImportance]"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[login]": (name)=>{
            setState({
                "usePlannerState.useCallback[login]": (prev)=>{
                    const user = {
                        name
                    };
                    saveAndUpdate(prev.events, user);
                    return {
                        ...prev,
                        user
                    };
                }
            }["usePlannerState.useCallback[login]"]);
        }
    }["usePlannerState.useCallback[login]"], [
        saveAndUpdate
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePlannerState.useCallback[logout]": ()=>{
            setState({
                "usePlannerState.useCallback[logout]": (prev)=>{
                    saveAndUpdate(prev.events, null);
                    return {
                        ...prev,
                        user: null
                    };
                }
            }["usePlannerState.useCallback[logout]"]);
        }
    }["usePlannerState.useCallback[logout]"], [
        saveAndUpdate
    ]);
    return {
        state,
        navigateWeek,
        goToToday,
        addEvent,
        addEvents,
        toggleComplete,
        deleteEvent,
        removeEventsByModule,
        postponeEvent,
        splitEvent,
        toggleDeleteMode,
        setDeleteMode,
        setPendingDelete,
        setPendingReadd,
        setPendingSplit,
        setSelectedImportance,
        login,
        logout
    };
}
_s(usePlannerState, "xD4qA/0NcJY/W842AqIVQvqskXI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useModuleState.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useModuleState",
    ()=>useModuleState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const defaultModState = {
    medicines: [],
    water: {
        height: 0,
        weight: 0,
        age: 0,
        gender: 'male',
        dailyGoal: 2500,
        log: {}
    },
    gym: {
        programs: [],
        activeProgram: null,
        exerciseLog: {}
    },
    birthdays: [],
    budget: {
        income: 0,
        expenses: [],
        shoppingLists: []
    },
    sleep: {
        logs: [],
        goalMin: 7,
        goalMax: 9
    },
    goals: []
};
function useModuleState() {
    _s();
    const [modState, setModState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultModState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useModuleState.useEffect": ()=>{
            const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadModuleData"])();
            setModState({
                "useModuleState.useEffect": (prev)=>({
                        ...prev,
                        ...saved
                    })
            }["useModuleState.useEffect"]);
        }
    }["useModuleState.useEffect"], []);
    const save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[save]": (next)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
            setModState(next);
        }
    }["useModuleState.useCallback[save]"], []);
    // Medicine
    const addMedicine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addMedicine]": (med)=>{
            setModState({
                "useModuleState.useCallback[addMedicine]": (prev)=>{
                    const next = {
                        ...prev,
                        medicines: [
                            ...prev.medicines,
                            med
                        ]
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addMedicine]"]);
        }
    }["useModuleState.useCallback[addMedicine]"], []);
    const deleteMedicine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[deleteMedicine]": (id)=>{
            setModState({
                "useModuleState.useCallback[deleteMedicine]": (prev)=>{
                    const next = {
                        ...prev,
                        medicines: prev.medicines.filter({
                            "useModuleState.useCallback[deleteMedicine]": (m)=>m.id !== id
                        }["useModuleState.useCallback[deleteMedicine]"])
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[deleteMedicine]"]);
        }
    }["useModuleState.useCallback[deleteMedicine]"], []);
    const toggleMedTaken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[toggleMedTaken]": (medId, date, freq)=>{
            setModState({
                "useModuleState.useCallback[toggleMedTaken]": (prev)=>{
                    const medicines = prev.medicines.map({
                        "useModuleState.useCallback[toggleMedTaken].medicines": (m)=>{
                            if (m.id !== medId) return m;
                            const log = {
                                ...m.takenLog
                            };
                            const dayLog = [
                                ...log[date] || []
                            ];
                            const idx = dayLog.indexOf(freq);
                            if (idx >= 0) dayLog.splice(idx, 1);
                            else dayLog.push(freq);
                            log[date] = dayLog;
                            return {
                                ...m,
                                takenLog: log
                            };
                        }
                    }["useModuleState.useCallback[toggleMedTaken].medicines"]);
                    const next = {
                        ...prev,
                        medicines
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[toggleMedTaken]"]);
        }
    }["useModuleState.useCallback[toggleMedTaken]"], []);
    // Water
    const addWater = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addWater]": (ml)=>{
            setModState({
                "useModuleState.useCallback[addWater]": (prev)=>{
                    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date());
                    const todayLog = prev.water.log[today] || {
                        total: 0,
                        entries: []
                    };
                    const now = new Date();
                    const time = "".concat(String(now.getHours()).padStart(2, '0'), ":").concat(String(now.getMinutes()).padStart(2, '0'));
                    const updated = {
                        total: todayLog.total + ml,
                        entries: [
                            ...todayLog.entries,
                            {
                                amount: ml,
                                time
                            }
                        ]
                    };
                    const next = {
                        ...prev,
                        water: {
                            ...prev.water,
                            log: {
                                ...prev.water.log,
                                [today]: updated
                            }
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addWater]"]);
        }
    }["useModuleState.useCallback[addWater]"], []);
    const saveWaterProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[saveWaterProfile]": (height, weight, age, gender)=>{
            setModState({
                "useModuleState.useCallback[saveWaterProfile]": (prev)=>{
                    const dailyGoal = Math.round((weight * 35 + (gender === 'male' ? 500 : 300)) / 100) * 100;
                    const next = {
                        ...prev,
                        water: {
                            ...prev.water,
                            height,
                            weight,
                            age,
                            gender,
                            dailyGoal
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[saveWaterProfile]"]);
        }
    }["useModuleState.useCallback[saveWaterProfile]"], []);
    // Gym
    const addExercise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addExercise]": (exercise)=>{
            setModState({
                "useModuleState.useCallback[addExercise]": (prev)=>{
                    let programs = [
                        ...prev.gym.programs
                    ];
                    const activeId = prev.gym.activeProgram;
                    if (activeId) {
                        programs = programs.map({
                            "useModuleState.useCallback[addExercise]": (p)=>p.id === activeId ? {
                                    ...p,
                                    exercises: [
                                        ...p.exercises,
                                        exercise
                                    ]
                                } : p
                        }["useModuleState.useCallback[addExercise]"]);
                    } else {
                        const newProgram = {
                            id: 'prog_' + Date.now(),
                            name: 'Programım',
                            exercises: [
                                exercise
                            ]
                        };
                        programs = [
                            newProgram
                        ];
                        const next = {
                            ...prev,
                            gym: {
                                ...prev.gym,
                                programs,
                                activeProgram: newProgram.id
                            }
                        };
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                        return next;
                    }
                    const next = {
                        ...prev,
                        gym: {
                            ...prev.gym,
                            programs
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addExercise]"]);
        }
    }["useModuleState.useCallback[addExercise]"], []);
    const useGymTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[useGymTemplate]": (templateExercises, name)=>{
            setModState({
                "useModuleState.useCallback[useGymTemplate]": (prev)=>{
                    const newProgram = {
                        id: 'prog_' + Date.now(),
                        name,
                        exercises: templateExercises
                    };
                    const next = {
                        ...prev,
                        gym: {
                            ...prev.gym,
                            programs: [
                                ...prev.gym.programs,
                                newProgram
                            ],
                            activeProgram: newProgram.id
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[useGymTemplate]"]);
        }
    }["useModuleState.useCallback[useGymTemplate]"], []);
    const toggleExercise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[toggleExercise]": (key)=>{
            setModState({
                "useModuleState.useCallback[toggleExercise]": (prev)=>{
                    const exerciseLog = {
                        ...prev.gym.exerciseLog,
                        [key]: !prev.gym.exerciseLog[key]
                    };
                    const next = {
                        ...prev,
                        gym: {
                            ...prev.gym,
                            exerciseLog
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[toggleExercise]"]);
        }
    }["useModuleState.useCallback[toggleExercise]"], []);
    // Birthday
    const addBirthday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addBirthday]": (bday)=>{
            setModState({
                "useModuleState.useCallback[addBirthday]": (prev)=>{
                    const next = {
                        ...prev,
                        birthdays: [
                            ...prev.birthdays,
                            bday
                        ]
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addBirthday]"]);
        }
    }["useModuleState.useCallback[addBirthday]"], []);
    const deleteBirthday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[deleteBirthday]": (id)=>{
            setModState({
                "useModuleState.useCallback[deleteBirthday]": (prev)=>{
                    const next = {
                        ...prev,
                        birthdays: prev.birthdays.filter({
                            "useModuleState.useCallback[deleteBirthday]": (b)=>b.id !== id
                        }["useModuleState.useCallback[deleteBirthday]"])
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[deleteBirthday]"]);
        }
    }["useModuleState.useCallback[deleteBirthday]"], []);
    // Budget
    const updateIncome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[updateIncome]": (income)=>{
            setModState({
                "useModuleState.useCallback[updateIncome]": (prev)=>{
                    const next = {
                        ...prev,
                        budget: {
                            ...prev.budget,
                            income
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[updateIncome]"]);
        }
    }["useModuleState.useCallback[updateIncome]"], []);
    const addExpense = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addExpense]": (expense)=>{
            setModState({
                "useModuleState.useCallback[addExpense]": (prev)=>{
                    const next = {
                        ...prev,
                        budget: {
                            ...prev.budget,
                            expenses: [
                                ...prev.budget.expenses,
                                expense
                            ]
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addExpense]"]);
        }
    }["useModuleState.useCallback[addExpense]"], []);
    const deleteExpense = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[deleteExpense]": (id)=>{
            setModState({
                "useModuleState.useCallback[deleteExpense]": (prev)=>{
                    const next = {
                        ...prev,
                        budget: {
                            ...prev.budget,
                            expenses: prev.budget.expenses.filter({
                                "useModuleState.useCallback[deleteExpense]": (e)=>e.id !== id
                            }["useModuleState.useCallback[deleteExpense]"])
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[deleteExpense]"]);
        }
    }["useModuleState.useCallback[deleteExpense]"], []);
    const addShoppingList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addShoppingList]": (list)=>{
            setModState({
                "useModuleState.useCallback[addShoppingList]": (prev)=>{
                    const next = {
                        ...prev,
                        budget: {
                            ...prev.budget,
                            shoppingLists: [
                                ...prev.budget.shoppingLists,
                                list
                            ]
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addShoppingList]"]);
        }
    }["useModuleState.useCallback[addShoppingList]"], []);
    const toggleShoppingItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[toggleShoppingItem]": (listId, itemIdx)=>{
            setModState({
                "useModuleState.useCallback[toggleShoppingItem]": (prev)=>{
                    const lists = prev.budget.shoppingLists.map({
                        "useModuleState.useCallback[toggleShoppingItem].lists": (l)=>{
                            if (l.id !== listId) return l;
                            const items = l.items.map({
                                "useModuleState.useCallback[toggleShoppingItem].lists.items": (item, i)=>i === itemIdx ? {
                                        ...item,
                                        checked: !item.checked
                                    } : item
                            }["useModuleState.useCallback[toggleShoppingItem].lists.items"]);
                            return {
                                ...l,
                                items
                            };
                        }
                    }["useModuleState.useCallback[toggleShoppingItem].lists"]);
                    const next = {
                        ...prev,
                        budget: {
                            ...prev.budget,
                            shoppingLists: lists
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[toggleShoppingItem]"]);
        }
    }["useModuleState.useCallback[toggleShoppingItem]"], []);
    // Sleep
    const addSleepLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addSleepLog]": (log)=>{
            setModState({
                "useModuleState.useCallback[addSleepLog]": (prev)=>{
                    const next = {
                        ...prev,
                        sleep: {
                            ...prev.sleep,
                            logs: [
                                ...prev.sleep.logs,
                                log
                            ]
                        }
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addSleepLog]"]);
        }
    }["useModuleState.useCallback[addSleepLog]"], []);
    // Goals
    const addGoal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[addGoal]": (goal)=>{
            setModState({
                "useModuleState.useCallback[addGoal]": (prev)=>{
                    const next = {
                        ...prev,
                        goals: [
                            ...prev.goals,
                            goal
                        ]
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[addGoal]"]);
        }
    }["useModuleState.useCallback[addGoal]"], []);
    const updateGoalProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[updateGoalProgress]": (id, delta)=>{
            setModState({
                "useModuleState.useCallback[updateGoalProgress]": (prev)=>{
                    const goals = prev.goals.map({
                        "useModuleState.useCallback[updateGoalProgress].goals": (g)=>g.id === id ? {
                                ...g,
                                current: Math.min(g.target, Math.max(0, g.current + delta))
                            } : g
                    }["useModuleState.useCallback[updateGoalProgress].goals"]);
                    const next = {
                        ...prev,
                        goals
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[updateGoalProgress]"]);
        }
    }["useModuleState.useCallback[updateGoalProgress]"], []);
    const deleteGoal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModuleState.useCallback[deleteGoal]": (id)=>{
            setModState({
                "useModuleState.useCallback[deleteGoal]": (prev)=>{
                    const next = {
                        ...prev,
                        goals: prev.goals.filter({
                            "useModuleState.useCallback[deleteGoal]": (g)=>g.id !== id
                        }["useModuleState.useCallback[deleteGoal]"])
                    };
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveModuleData"])(next);
                    return next;
                }
            }["useModuleState.useCallback[deleteGoal]"]);
        }
    }["useModuleState.useCallback[deleteGoal]"], []);
    return {
        modState,
        save,
        addMedicine,
        deleteMedicine,
        toggleMedTaken,
        addWater,
        saveWaterProfile,
        addExercise,
        useGymTemplate,
        toggleExercise,
        addBirthday,
        deleteBirthday,
        updateIncome,
        addExpense,
        deleteExpense,
        addShoppingList,
        toggleShoppingItem,
        addSleepLog,
        addGoal,
        updateGoalProgress,
        deleteGoal
    };
}
_s(useModuleState, "xxmuXVxVTG8d8BSbQmfjul9/LH8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AppSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function AppSidebar(param) {
    let { activeModule, onHome, onModule, onAddEvent, onRemoveEvent, onProfile, deleteMode, isLoggedIn } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "sidebar",
        id: "sidebar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn home-btn".concat(!activeModule ? ' active' : ''),
                        id: "homeBtn",
                        title: "Ana Sayfa",
                        onClick: onHome,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 28,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                    points: "9 22 9 12 15 12 15 22"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 28,
                                    columnNumber: 92
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-sep"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'medicine' ? ' active' : ''),
                        id: "medicineBtn",
                        title: "İlaç",
                        onClick: ()=>onModule('medicine'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 32,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "9",
                                    y1: "9",
                                    x2: "15",
                                    y2: "9"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 32,
                                    columnNumber: 205
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "9",
                                    y1: "13",
                                    x2: "15",
                                    y2: "13"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 32,
                                    columnNumber: 241
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'water' ? ' active' : ''),
                        id: "waterBtn",
                        title: "Su",
                        onClick: ()=>onModule('water'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AppSidebar.tsx",
                                lineNumber: 35,
                                columnNumber: 36
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'gym' ? ' active' : ''),
                        id: "gymBtn",
                        title: "Gym",
                        onClick: ()=>onModule('gym'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6.5 6.5h11M6.5 17.5h11"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 38,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "2",
                                    y: "8.5",
                                    width: "4",
                                    height: "7",
                                    rx: "1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 38,
                                    columnNumber: 71
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "18",
                                    y: "8.5",
                                    width: "4",
                                    height: "7",
                                    rx: "1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 38,
                                    columnNumber: 120
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "6.5",
                                    y1: "12",
                                    x2: "17.5",
                                    y2: "12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 38,
                                    columnNumber: 170
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn bday-btn".concat(activeModule === 'birthday' ? ' active' : ''),
                        id: "birthdayBtn",
                        title: "Doğum Günleri",
                        onClick: ()=>onModule('birthday'),
                        children: "🎂"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'budget' ? ' active' : ''),
                        id: "budgetBtn",
                        title: "Bütçe",
                        onClick: ()=>onModule('budget'),
                        children: "💰"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'sleep' ? ' active' : ''),
                        id: "sleepBtn",
                        title: "Uyku",
                        onClick: ()=>onModule('sleep'),
                        children: "😴"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'goals' ? ' active' : ''),
                        id: "goalsBtn",
                        title: "Hedefler",
                        onClick: ()=>onModule('goals'),
                        children: "🎯"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(activeModule === 'statistics' ? ' active' : ''),
                        id: "statisticsBtn",
                        title: "İstatistikler",
                        onClick: ()=>onModule('statistics'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "18",
                                    y1: "20",
                                    x2: "18",
                                    y2: "10"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 45,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "12",
                                    y1: "20",
                                    x2: "12",
                                    y2: "4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 45,
                                    columnNumber: 75
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "6",
                                    y1: "20",
                                    x2: "6",
                                    y2: "14"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 45,
                                    columnNumber: 113
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "2",
                                    y1: "20",
                                    x2: "22",
                                    y2: "20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 45,
                                    columnNumber: 150
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AppSidebar.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sidebar-bottom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn add-btn",
                        id: "addEventBtn",
                        title: "Etkinlik Ekle",
                        onClick: onAddEvent,
                        children: "+"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn remove-btn".concat(deleteMode ? ' active' : ''),
                        id: "removeEventBtn",
                        title: "Etkinlik Sil",
                        onClick: onRemoveEvent,
                        children: "−"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sidebar-sep"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "sidebar-btn".concat(isLoggedIn ? ' active' : ''),
                        id: "profileBtn",
                        title: "Profil",
                        onClick: onProfile,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 53,
                                    columnNumber: 36
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "12",
                                    cy: "7",
                                    r: "4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AppSidebar.tsx",
                                    lineNumber: 53,
                                    columnNumber: 89
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/AppSidebar.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AppSidebar.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AppSidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AppSidebar.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = AppSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DAYS_SHORT",
    ()=>DAYS_SHORT,
    "DAYS_TR",
    ()=>DAYS_TR,
    "END_HOUR",
    ()=>END_HOUR,
    "GYM_TEMPLATES",
    ()=>GYM_TEMPLATES,
    "HOUR_HEIGHT",
    ()=>HOUR_HEIGHT,
    "MONTHS_TR",
    ()=>MONTHS_TR,
    "POSTPONE_REASON_LABELS",
    ()=>POSTPONE_REASON_LABELS,
    "START_HOUR",
    ()=>START_HOUR
]);
const DAYS_TR = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar'
];
const DAYS_SHORT = [
    'Pzt',
    'Sal',
    'Çar',
    'Per',
    'Cum',
    'Cmt',
    'Paz'
];
const MONTHS_TR = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
];
const START_HOUR = 8;
const END_HOUR = 23;
const HOUR_HEIGHT = 60;
const POSTPONE_REASON_LABELS = {
    too_big: '😰 Çok büyük',
    no_time: '⏰ Zaman yok',
    dont_know: '🤷 Nereden başlasam',
    no_energy: '😴 Enerji yok',
    priorities: '🔄 Öncelik değişti',
    other: '📝 Diğer'
};
const GYM_TEMPLATES = [
    {
        name: 'Push/Pull/Legs',
        exercises: [
            {
                day: 'Pzt',
                name: 'Bench Press',
                muscle: 'Göğüs',
                sets: 4,
                reps: 8
            },
            {
                day: 'Pzt',
                name: 'Shoulder Press',
                muscle: 'Omuz',
                sets: 3,
                reps: 10
            },
            {
                day: 'Pzt',
                name: 'Tricep Pushdown',
                muscle: 'Triseps',
                sets: 3,
                reps: 12
            },
            {
                day: 'Çar',
                name: 'Pull-Up',
                muscle: 'Sırt',
                sets: 4,
                reps: 8
            },
            {
                day: 'Çar',
                name: 'Barbell Row',
                muscle: 'Sırt',
                sets: 3,
                reps: 10
            },
            {
                day: 'Çar',
                name: 'Bicep Curl',
                muscle: 'Biseps',
                sets: 3,
                reps: 12
            },
            {
                day: 'Cum',
                name: 'Squat',
                muscle: 'Bacak',
                sets: 4,
                reps: 8
            },
            {
                day: 'Cum',
                name: 'Leg Press',
                muscle: 'Bacak',
                sets: 3,
                reps: 12
            },
            {
                day: 'Cum',
                name: 'Calf Raise',
                muscle: 'Baldır',
                sets: 3,
                reps: 15
            }
        ]
    },
    {
        name: 'Full Body',
        exercises: [
            {
                day: 'Pzt',
                name: 'Squat',
                muscle: 'Bacak',
                sets: 3,
                reps: 10
            },
            {
                day: 'Pzt',
                name: 'Push-Up',
                muscle: 'Göğüs',
                sets: 3,
                reps: 12
            },
            {
                day: 'Pzt',
                name: 'Dumbbell Row',
                muscle: 'Sırt',
                sets: 3,
                reps: 10
            },
            {
                day: 'Çar',
                name: 'Deadlift',
                muscle: 'Sırt/Bacak',
                sets: 3,
                reps: 8
            },
            {
                day: 'Çar',
                name: 'Overhead Press',
                muscle: 'Omuz',
                sets: 3,
                reps: 10
            },
            {
                day: 'Cum',
                name: 'Lunge',
                muscle: 'Bacak',
                sets: 3,
                reps: 12
            },
            {
                day: 'Cum',
                name: 'Plank',
                muscle: 'Core',
                sets: 3,
                reps: 30
            }
        ]
    },
    {
        name: 'Upper/Lower',
        exercises: [
            {
                day: 'Pzt',
                name: 'Bench Press',
                muscle: 'Göğüs',
                sets: 4,
                reps: 8
            },
            {
                day: 'Pzt',
                name: 'Pull-Up',
                muscle: 'Sırt',
                sets: 3,
                reps: 10
            },
            {
                day: 'Sal',
                name: 'Squat',
                muscle: 'Bacak',
                sets: 4,
                reps: 8
            },
            {
                day: 'Sal',
                name: 'Leg Curl',
                muscle: 'Bacak',
                sets: 3,
                reps: 12
            },
            {
                day: 'Per',
                name: 'Shoulder Press',
                muscle: 'Omuz',
                sets: 3,
                reps: 10
            },
            {
                day: 'Per',
                name: 'Barbell Row',
                muscle: 'Sırt',
                sets: 4,
                reps: 8
            },
            {
                day: 'Cum',
                name: 'Deadlift',
                muscle: 'Sırt',
                sets: 4,
                reps: 6
            },
            {
                day: 'Cum',
                name: 'Leg Press',
                muscle: 'Bacak',
                sets: 3,
                reps: 12
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/calendar/CalSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const DAY_HEADERS = [
    'Pt',
    'Sa',
    'Ça',
    'Pe',
    'Cu',
    'Ct',
    'Pa'
];
const CATEGORIES = [
    {
        name: 'Yüksek Öncelik',
        color: '#ef4444'
    },
    {
        name: 'Orta Öncelik',
        color: '#f97316'
    },
    {
        name: 'Düşük Öncelik',
        color: '#3b82f6'
    },
    {
        name: 'Tamamlanan',
        color: '#22c55e'
    }
];
const MODULES_LIST = [
    {
        name: 'İlaç',
        color: '#10b981'
    },
    {
        name: 'Su Takibi',
        color: '#06b6d4'
    },
    {
        name: 'Gym',
        color: '#f97316'
    },
    {
        name: 'Doğum Günleri',
        color: '#ec4899'
    }
];
function CalSidebar(param) {
    let { currentWeekStart, events, onAddEvent } = param;
    _s();
    const [monthOffset, setMonthOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const weekDateStrs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(currentWeekStart).map((d)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d));
    const base = new Date(currentWeekStart);
    base.setMonth(base.getMonth() + monthOffset);
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthDays = [];
    for(let i = 0; i < startOffset; i++){
        const d = new Date(year, month, -startOffset + i + 1);
        prevMonthDays.push(d.getDate());
    }
    const currentDays = [];
    for(let day = 1; day <= lastDay.getDate(); day++){
        const d = new Date(year, month, day);
        const dStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d);
        currentDays.push({
            day,
            dStr,
            todayFlag: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isToday"])(d),
            inWeek: weekDateStrs.includes(dStr),
            hasEv: events.some((e)=>e.date === dStr)
        });
    }
    const filled = startOffset + lastDay.getDate();
    const remaining = filled % 7 === 0 ? 0 : 7 - filled % 7;
    const nextDays = Array.from({
        length: remaining
    }, (_, i)=>i + 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cal-sidebar",
        id: "calSidebar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mini-cal-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mini-cal-month",
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTHS_TR"][month],
                            " ",
                            year
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "mini-cal-nav-btn",
                                onClick: ()=>setMonthOffset((o)=>o - 1),
                                children: "‹"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "mini-cal-nav-btn",
                                onClick: ()=>setMonthOffset((o)=>o + 1),
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mini-cal-grid",
                children: [
                    DAY_HEADERS.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mini-cal-day-header",
                            children: h
                        }, h, false, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)),
                    prevMonthDays.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mini-cal-day other-month",
                            children: d
                        }, "prev-".concat(i), false, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this)),
                    currentDays.map((param)=>{
                        let { day, dStr, todayFlag, inWeek, hasEv } = param;
                        let cls = 'mini-cal-day';
                        if (todayFlag) cls += ' today';
                        else if (inWeek) cls += ' current-week';
                        if (hasEv) cls += ' has-event';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: cls,
                            children: day
                        }, dStr, false, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 88,
                            columnNumber: 18
                        }, this);
                    }),
                    nextDays.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mini-cal-day other-month",
                            children: d
                        }, "next-".concat(i), false, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cal-sidebar-sep"
            }, void 0, false, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cal-sidebar-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cal-sidebar-section-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "cal-sidebar-section-title",
                                children: "Takvimlerim"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "cal-sidebar-add-btn",
                                onClick: onAddEvent,
                                children: "+"
                            }, void 0, false, {
                                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    CATEGORIES.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cal-cat-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cal-cat-checkbox checked",
                                    style: {
                                        borderColor: c.color,
                                        background: c.color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "cal-cat-name",
                                    children: c.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, c.name, true, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cal-sidebar-sep"
            }, void 0, false, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cal-sidebar-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cal-sidebar-section-header",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "cal-sidebar-section-title",
                            children: "Modüller"
                        }, void 0, false, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    MODULES_LIST.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cal-cat-item",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cal-cat-dot",
                                    style: {
                                        background: m.color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "cal-cat-name",
                                    children: m.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, m.name, true, {
                            fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalSidebar.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/calendar/CalSidebar.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(CalSidebar, "C9czNxKbuQWCyu/pQyjysrH/Zyc=");
_c = CalSidebar;
var _c;
__turbopack_context__.k.register(_c, "CalSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/calendar/CalMainHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalMainHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function CalMainHeader(param) {
    let { currentWeekStart, onToday, onPrev, onNext, onTour, onAddEvent } = param;
    const dates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(currentWeekStart);
    const start = dates[0];
    const end = dates[6];
    const title = start.getMonth() === end.getMonth() ? "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTHS_TR"][start.getMonth()], " ").concat(start.getFullYear()) : "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTHS_TR"][start.getMonth()], " – ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MONTHS_TR"][end.getMonth()], " ").concat(end.getFullYear());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cal-main-header",
        id: "calMainHeader",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "cal-main-title",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cal-main-actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cal-today-btn",
                        onClick: onToday,
                        children: "Bugün"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cal-nav-btn",
                        onClick: onPrev,
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cal-nav-btn",
                        onClick: onNext,
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cal-icon-btn",
                        title: "Rehber",
                        onClick: onTour,
                        children: "ℹ️"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cal-add-btn",
                        onClick: onAddEvent,
                        children: "+ Etkinlik Ekle"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/calendar/CalMainHeader.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = CalMainHeader;
var _c;
__turbopack_context__.k.register(_c, "CalMainHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/calendar/CalendarSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function CalendarSection(param) {
    let { currentWeekStart, events, deleteMode, onEventClick, onDeleteEvent, getBirthdayBanners } = param;
    const dates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(currentWeekStart);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "calendar-section",
        id: "calendarSection",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calendar-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "cal-time-header",
                        children: "Saat"
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    dates.map((d, i)=>{
                        const cls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isToday"])(d) ? ' today' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPast"])(d) ? ' past' : '';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cal-day-header".concat(cls),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "day-name",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_SHORT"][i]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                    lineNumber: 30,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "day-date",
                                    children: d.getDate()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                    lineNumber: 31,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calendar-body".concat(deleteMode ? ' delete-mode' : ''),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "time-labels",
                        children: Array.from({
                            length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["END_HOUR"] - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["START_HOUR"] + 1
                        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "time-label",
                                children: [
                                    String(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["START_HOUR"] + i).padStart(2, '0'),
                                    ":00"
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    dates.map((d, dayIdx)=>{
                        const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d);
                        const colCls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isToday"])(d) ? ' today-col' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPast"])(d) ? ' past-col' : '';
                        const bdays = getBirthdayBanners ? getBirthdayBanners(dateStr) : [];
                        const dayEvents = events.filter((e)=>e.date === dateStr && e.moduleType !== 'birthday');
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "day-column".concat(colCls),
                            "data-date": dateStr,
                            children: [
                                bdays.map((b, bi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bday-banner",
                                        children: [
                                            "🎂 ",
                                            b.name
                                        ]
                                    }, bi, true, {
                                        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this)),
                                Array.from({
                                    length: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["END_HOUR"] - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["START_HOUR"] + 1
                                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hour-line",
                                        style: {
                                            top: i * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOUR_HEIGHT"]
                                        }
                                    }, i, false, {
                                        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                        lineNumber: 61,
                                        columnNumber: 17
                                    }, this)),
                                dayEvents.map((ev)=>{
                                    const [sh, sm] = ev.startTime.split(':').map(Number);
                                    const [eh, em] = ev.endTime.split(':').map(Number);
                                    const startH = sh + sm / 60;
                                    const endH = eh + em / 60;
                                    const top = (startH - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["START_HOUR"]) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOUR_HEIGHT"];
                                    const height = Math.max((endH - startH) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOUR_HEIGHT"], 28);
                                    const impCls = ev.importance === 'high' ? 'imp-high' : ev.importance === 'medium' ? 'imp-med' : 'imp-low';
                                    const completedCls = ev.completed ? ' completed' : '';
                                    const ppCount = ev.postponeCount || 0;
                                    const ppClass = ppCount >= 3 ? ' chronic-postpone' : ppCount >= 1 ? ' postponed' : '';
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "event-card ".concat(impCls).concat(completedCls).concat(ppClass),
                                        style: {
                                            top,
                                            height
                                        },
                                        "data-id": ev.id,
                                        onClick: ()=>onEventClick(ev.id),
                                        children: [
                                            ppCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "postpone-badge",
                                                title: "".concat(ppCount, " kez ertelendi"),
                                                children: [
                                                    "🔄",
                                                    ppCount
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                                lineNumber: 88,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "event-name",
                                                children: ev.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                                lineNumber: 92,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "event-time",
                                                children: [
                                                    ev.startTime,
                                                    " - ",
                                                    ev.endTime
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                                lineNumber: 93,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "delete-badge",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onDeleteEvent(ev.id);
                                                },
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                                lineNumber: 94,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, ev.id, true, {
                                        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                                        lineNumber: 80,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, dayIdx, true, {
                            fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/calendar/CalendarSection.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/calendar/CalendarSection.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = CalendarSection;
var _c;
__turbopack_context__.k.register(_c, "CalendarSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/CompletionSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CompletionSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function CompletionSection(param) {
    let { events, currentWeekStart, onReadd } = param;
    const dates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(currentWeekStart);
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date());
    const weekDates = dates.map(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"]);
    const uncompleted = events.filter((e)=>weekDates.includes(e.date) && e.date < today && !e.completed);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "completion-section",
        id: "completionSection",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "📊 Haftalık Tamamlanma"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chart-container",
                id: "chartContainer",
                children: dates.map((d, i)=>{
                    const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d);
                    const dayEvents = events.filter((e)=>e.date === dateStr);
                    const total = dayEvents.length;
                    const completed = dayEvents.filter((e)=>e.completed).length;
                    const pct = total > 0 ? Math.round(completed / total * 100) : 0;
                    const barH = total > 0 ? Math.max(pct / 100 * 160, 6) : 6;
                    const pastCls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPast"])(d) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isToday"])(d) ? ' past-bar' : '';
                    const emptyCls = total === 0 ? ' empty' : '';
                    const todayCls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isToday"])(d) ? ' today-label' : '';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chart-bar-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chart-percent",
                                children: total > 0 ? "".concat(pct, "%") : '-'
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "chart-bar".concat(pastCls).concat(emptyCls),
                                style: {
                                    height: barH
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                lineNumber: 40,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "chart-day-name".concat(todayCls),
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_SHORT"][i]
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/sections/CompletionSection.tsx",
                        lineNumber: 38,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "uncompleted-section",
                id: "uncompletedSection",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "⚠️ Tamamlanmayan Görevler"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/CompletionSection.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "uncompletedList",
                        children: uncompleted.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "no-uncompleted",
                            children: "🎉 Tüm geçmiş görevler tamamlandı!"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/CompletionSection.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this) : uncompleted.map((ev)=>{
                            const dateObj = new Date(ev.date);
                            const dayName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_TR"][dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "uncompleted-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "uncompleted-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "name",
                                                children: ev.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                                lineNumber: 59,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "detail",
                                                children: [
                                                    dayName,
                                                    " • ",
                                                    ev.startTime,
                                                    " - ",
                                                    ev.endTime
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                                lineNumber: 60,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                        lineNumber: 58,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "readd-btn",
                                        onClick: ()=>onReadd(ev.id),
                                        children: "Tekrar Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                        lineNumber: 62,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, ev.id, true, {
                                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                                lineNumber: 57,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/CompletionSection.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/CompletionSection.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/CompletionSection.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = CompletionSection;
var _c;
__turbopack_context__.k.register(_c, "CompletionSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/PostponeSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PostponeSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function calculateStreak(events) {
    const today = new Date();
    let streak = 0;
    for(let i = 0; i < 30; i++){
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d);
        const dayEvents = events.filter((e)=>e.date === dateStr);
        if (dayEvents.length === 0) continue;
        const hasPostpone = dayEvents.some((e)=>(e.postponeHistory || []).some((h)=>h.to === dateStr));
        if (hasPostpone) break;
        if (dayEvents.some((e)=>e.completed)) streak++;
    }
    return streak;
}
function PostponeSection(param) {
    let { events, onSplit } = param;
    const postponedEvents = events.filter((e)=>(e.postponeCount || 0) > 0);
    const totalPostpones = postponedEvents.reduce((s, e)=>s + (e.postponeCount || 0), 0);
    const chronicEvents = postponedEvents.filter((e)=>(e.postponeCount || 0) >= 3);
    const completedAfterPostpone = postponedEvents.filter((e)=>e.completed).length;
    const streak = calculateStreak(events);
    const reasonCounts = {};
    postponedEvents.forEach((ev)=>{
        (ev.postponeHistory || []).forEach((h)=>{
            reasonCounts[h.reason] = (reasonCounts[h.reason] || 0) + 1;
        });
    });
    const topPostponed = [
        ...postponedEvents
    ].filter((e)=>!e.completed).sort((a, b)=>(b.postponeCount || 0) - (a.postponeCount || 0)).slice(0, 3);
    const maxReasonCount = Math.max(...Object.values(reasonCounts), 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "postpone-section",
        id: "postponeSection",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "🔄 Erteleme Analizi"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pp-stats-grid",
                children: [
                    {
                        icon: '🔄',
                        val: totalPostpones,
                        label: 'Toplam Erteleme'
                    },
                    {
                        icon: '🚨',
                        val: chronicEvents.length,
                        label: 'Kronik (3+)'
                    },
                    {
                        icon: '✅',
                        val: completedAfterPostpone,
                        label: 'Sonunda Tamamlanan'
                    },
                    {
                        icon: '🔥',
                        val: streak,
                        label: 'Gün Streak'
                    }
                ].map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pp-stat-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pp-stat-icon",
                                children: s.icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pp-stat-val",
                                children: s.val
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pp-stat-label",
                                children: s.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/src/components/sections/PostponeSection.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            totalPostpones > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pp-detail-grid",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pp-detail-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "📊 Erteleme Nedenleri"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pp-reason-bars",
                                children: Object.entries(reasonCounts).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        fontSize: '0.8rem'
                                    },
                                    children: "Henüz veri yok"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                    lineNumber: 75,
                                    columnNumber: 17
                                }, this) : Object.entries(reasonCounts).sort((a, b)=>b[1] - a[1]).map((param)=>{
                                    let [key, count] = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pp-reason-bar-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pp-reason-label",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["POSTPONE_REASON_LABELS"][key] || key
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 81,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pp-reason-bar-bg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pp-reason-bar-fill",
                                                    style: {
                                                        width: "".concat(Math.round(count / maxReasonCount * 100), "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                    lineNumber: 83,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 82,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pp-reason-count",
                                                children: count
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 88,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                        lineNumber: 80,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/PostponeSection.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pp-detail-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "🔝 En Çok Ertelenen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pp-top-list",
                                children: topPostponed.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        fontSize: '0.8rem',
                                        textAlign: 'center'
                                    },
                                    children: "Ertelenen görev yok 🎉"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this) : topPostponed.map((ev)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pp-top-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pp-top-badge",
                                                children: [
                                                    ev.postponeCount,
                                                    "x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 102,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pp-top-name",
                                                children: ev.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 103,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "pp-split-btn",
                                                onClick: ()=>onSplit(ev.id),
                                                title: "Parçalara böl",
                                                children: "✂️"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                                lineNumber: 104,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, ev.id, true, {
                                        fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                        lineNumber: 101,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/PostponeSection.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pp-empty",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "🎉 Henüz erteleme yok! Harika gidiyorsun."
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/PostponeSection.tsx",
                    lineNumber: 112,
                    columnNumber: 35
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/sections/PostponeSection.tsx",
                lineNumber: 112,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/PostponeSection.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = PostponeSection;
var _c;
__turbopack_context__.k.register(_c, "PostponeSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/FAQSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FAQSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const FAQ_ITEMS = [
    {
        q: 'Hackathon Planner nedir?',
        a: 'Hackathon Planner, hackathon etkinlikleri için tasarlanmış bir haftalık planlama ve görev yönetim aracıdır. Etkinliklerinizi kolayca planlayabilir, takip edebilir ve tamamlanma durumlarını kontrol edebilirsiniz.'
    },
    {
        q: 'Etkinlik nasıl eklenir?',
        a: 'Sol kenar çubuğundaki yeşil "+" butonuna tıklayarak etkinlik ekleme formunu açabilirsiniz. Etkinlik adı, tarih, saat ve önem seviyesini belirleyerek yeni etkinlik oluşturabilirsiniz.'
    },
    {
        q: 'Önem seviyeleri ne anlama geliyor?',
        a: 'Kırmızı: En yüksek öncelikli görevler (kritik). Turuncu: Orta öncelikli görevler. Mavi: Düşük öncelikli görevler. Renk kodları sayesinde görevlerinizi hızlıca önceliklendirebilirsiniz.'
    },
    {
        q: 'Tamamlanan görevleri nasıl işaretlerim?',
        a: 'Takvimde bir etkinliğe tıklayarak onu tamamlandı olarak işaretleyebilirsiniz. Tamamlanan görevler yeşil renk alır ve üzeri çizili gösterilir.'
    },
    {
        q: 'Verilerim güvende mi?',
        a: 'Tüm verileriniz tarayıcınızın yerel depolama alanında (localStorage) saklanır. Verileriniz sunuculara gönderilmez ve tamamen cihazınızda kalır.'
    },
    {
        q: 'Etkinlik nasıl silinir?',
        a: 'Sol kenar çubuğundaki kırmızı "−" butonuna tıklayarak silme modunu aktif edin. Ardından silmek istediğiniz etkinlikteki "×" işaretine tıklayın. Onay verdikten sonra etkinlik silinecektir.'
    }
];
function FAQSection() {
    _s();
    const [openIdx, setOpenIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "faq-section",
        id: "faqSection",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "❓ Sıkça Sorulan Sorular"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/FAQSection.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            FAQ_ITEMS.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "faq-item".concat(openIdx === i ? ' open' : ''),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "faq-question",
                            onClick: ()=>setOpenIdx(openIdx === i ? null : i),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.q
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/FAQSection.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "arrow",
                                    children: "▼"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/FAQSection.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/sections/FAQSection.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "faq-answer",
                            children: item.a
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/FAQSection.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/src/components/sections/FAQSection.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/FAQSection.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(FAQSection, "JHeU1KdNesf9XDvPtRBg+hOAqPM=");
_c = FAQSection;
var _c;
__turbopack_context__.k.register(_c, "FAQSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/GuidedTour.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GuidedTour
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const TOUR_STEPS = [
    {
        target: '#inboxBar',
        title: '📬 Bildirim Çubuğu',
        desc: 'Bugünkü etkinlik sayısı, su durumu, ilaç uyarıları ve yaklaşan doğum günleri burada görünür.',
        pos: 'bottom'
    },
    {
        target: '.calendar-section',
        title: '📅 Haftalık Takvim',
        desc: 'Tüm etkinlikleriniz burada saatlik olarak gösterilir. Bir etkinliğe tıklayarak tamamlandı olarak işaretleyebilirsiniz.',
        pos: 'bottom'
    },
    {
        target: '#homeBtn',
        title: '🏠 Ana Sayfa',
        desc: 'Ana takvim görünümüne dönmek için bu butona tıklayın.',
        pos: 'right'
    },
    {
        target: '#medicineBtn',
        title: '💊 İlaç Takibi',
        desc: 'İlaçlarınızı ekleyin, dozaj ve zamanlamalarını takip edin. İlaç azaldığında uyarı alırsınız.',
        pos: 'right'
    },
    {
        target: '#waterBtn',
        title: '💧 Su Takibi',
        desc: 'Günlük su tüketiminizi takip edin. Boy/kilo bilgilerinize göre kişisel hedef hesaplanır.',
        pos: 'right'
    },
    {
        target: '#gymBtn',
        title: '🏋️ Gym Takibi',
        desc: 'Antrenman programınızı oluşturun, hazır şablonları kullanın ve hareketlerinizi tamamlayın.',
        pos: 'right'
    },
    {
        target: '#birthdayBtn',
        title: '🎂 Doğum Günleri',
        desc: 'Yakınlarınızın doğum günlerini ekleyin, hediye takibi yapın. Takvimde üst kısımda banner olarak görünür.',
        pos: 'right'
    },
    {
        target: '#budgetBtn',
        title: '💰 Bütçe & Alışveriş',
        desc: 'Aylık gelir ve harcamalarınızı takip edin. Market alışveriş listeleri oluşturup takvimde gösterin.',
        pos: 'right'
    },
    {
        target: '#sleepBtn',
        title: '😴 Uyku Takibi',
        desc: 'Uyku saatlerinizi kaydedin, detaylı sağlık raporu alın. Yetersiz uykunun etkilerini görün.',
        pos: 'right'
    },
    {
        target: '#goalsBtn',
        title: '🎯 Hedef Takibi',
        desc: 'Kişisel hedefler belirleyin ve ilerlemenizi takip edin. Motivasyon mesajları ile hedefe ulaşın!',
        pos: 'right'
    },
    {
        target: '#addEventBtn',
        title: '➕ Etkinlik Ekle',
        desc: 'Yeni etkinlik oluşturmak için bu yeşil butona tıklayın. Ad, tarih, saat ve önem seviyesi belirleyin.',
        pos: 'right'
    },
    {
        target: '#removeEventBtn',
        title: '➖ Etkinlik Sil',
        desc: 'Silme modunu aktif edin, ardından takvimde silmek istediğiniz etkinliğin × işaretine tıklayın.',
        pos: 'right'
    },
    {
        target: '#profileBtn',
        title: '👤 Profil',
        desc: 'Kullanıcı girişi yapın. Verileriniz tarayıcınızda güvenle saklanır.',
        pos: 'right'
    },
    {
        target: '.bottom-panels',
        title: '📊 Alt Paneller',
        desc: 'Sol: AI Asistan (yakında). Sağ: Bu haftaki yaklaşan etkinlikleriniz listesi.',
        pos: 'top'
    },
    {
        target: '.completion-section',
        title: '📈 Haftalık Tamamlanma',
        desc: 'Her günün görev tamamlanma yüzdesini grafik olarak görün. Tamamlanmayan görevleri tekrar ekleyebilirsiniz.',
        pos: 'top'
    }
];
function GuidedTour(param) {
    let { active, onEnd } = param;
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [popupStyle, setPopupStyle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)'
    });
    const [arrowClass, setArrowClass] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const positionPopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GuidedTour.useCallback[positionPopup]": (el, pos)=>{
            const rect = el.getBoundingClientRect();
            const pw = 340, ph = 180;
            let top, left;
            let aC = '';
            if (pos === 'right') {
                top = rect.top + rect.height / 2 - ph / 2;
                left = rect.right + 16;
                aC = 'arrow-left';
            } else if (pos === 'bottom') {
                top = rect.bottom + 16;
                left = rect.left + rect.width / 2 - pw / 2;
                aC = 'arrow-top';
            } else {
                top = rect.top - ph - 16;
                left = rect.left + rect.width / 2 - pw / 2;
                aC = 'arrow-bottom';
            }
            top = Math.max(10, Math.min(top, window.innerHeight - ph - 10));
            left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));
            setPopupStyle({
                top,
                left,
                transform: 'none'
            });
            setArrowClass(aC);
        }
    }["GuidedTour.useCallback[positionPopup]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GuidedTour.useEffect": ()=>{
            if (!active) return;
            document.querySelectorAll('.tour-highlight').forEach({
                "GuidedTour.useEffect": (e)=>e.classList.remove('tour-highlight')
            }["GuidedTour.useEffect"]);
            const s = TOUR_STEPS[step];
            if (!s) return;
            const el = document.querySelector(s.target);
            if (el) {
                el.classList.add('tour-highlight');
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                setTimeout({
                    "GuidedTour.useEffect": ()=>positionPopup(el, s.pos)
                }["GuidedTour.useEffect"], 300);
            } else {
                setPopupStyle({
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)'
                });
                setArrowClass('');
            }
        }
    }["GuidedTour.useEffect"], [
        active,
        step,
        positionPopup
    ]);
    if (!active) return null;
    const current = TOUR_STEPS[step];
    const handleEnd = ()=>{
        document.querySelectorAll('.tour-highlight').forEach((e)=>e.classList.remove('tour-highlight'));
        onEnd();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "tour-overlay active",
        id: "tourOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tour-backdrop",
                id: "tourBackdrop"
            }, void 0, false, {
                fileName: "[project]/src/components/GuidedTour.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tour-popup",
                id: "tourPopup",
                style: popupStyle,
                children: [
                    arrowClass && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tour-arrow ".concat(arrowClass),
                        id: "tourArrow"
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuidedTour.tsx",
                        lineNumber: 94,
                        columnNumber: 24
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tour-step-indicator",
                        children: [
                            step + 1,
                            " / ",
                            TOUR_STEPS.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/GuidedTour.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: current.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuidedTour.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: current.desc
                    }, void 0, false, {
                        fileName: "[project]/src/components/GuidedTour.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tour-btns",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "tour-btn-skip",
                                onClick: handleEnd,
                                children: "Kapat"
                            }, void 0, false, {
                                fileName: "[project]/src/components/GuidedTour.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 6
                                },
                                children: [
                                    step > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "tour-btn-prev",
                                        onClick: ()=>setStep((s)=>s - 1),
                                        children: "← Geri"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/GuidedTour.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "tour-btn-next",
                                        onClick: ()=>{
                                            if (step >= TOUR_STEPS.length - 1) handleEnd();
                                            else setStep((s)=>s + 1);
                                        },
                                        children: step === TOUR_STEPS.length - 1 ? 'Bitir ✓' : 'İleri →'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/GuidedTour.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/GuidedTour.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/GuidedTour.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/GuidedTour.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/GuidedTour.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(GuidedTour, "BpQt+yrRV1FA3RJHL8NGdR/Qyq8=");
_c = GuidedTour;
var _c;
__turbopack_context__.k.register(_c, "GuidedTour");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/LoginModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function LoginModal(param) {
    let { open, user, onClose, onLogin, onLogout } = param;
    _s();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleLogin = ()=>{
        if (!username.trim()) {
            alert('Kullanıcı adı girin');
            return;
        }
        if (!password) {
            alert('Şifre girin');
            return;
        }
        onLogin(username.trim());
        setUsername('');
        setPassword('');
    };
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay active",
        id: "loginModal",
        onClick: (e)=>{
            if (e.target === e.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal",
            style: {
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "modal-close",
                    onClick: onClose,
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "👤 Profil Girişi"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "loggedInView",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "user-badge",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "avatar",
                                    children: user.name.charAt(0).toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 36,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "username",
                                    children: user.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 37,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn secondary",
                            onClick: onLogout,
                            children: "Çıkış Yap"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "loginForm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "login-info",
                            children: "Planlarınıza erişmek için giriş yapın"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Kullanıcı Adı"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 45,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Kullanıcı adınız",
                                    value: username,
                                    onChange: (e)=>setUsername(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 44,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "form-group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    children: "Şifre"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "Şifreniz",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    onKeyDown: (e)=>e.key === 'Enter' && handleLogin()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                                    lineNumber: 50,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn primary",
                            onClick: handleLogin,
                            children: "Giriş Yap"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/LoginModal.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/LoginModal.tsx",
                    lineNumber: 42,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/modals/LoginModal.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/modals/LoginModal.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(LoginModal, "wuQOK7xaXdVz4RMrZQhWbI751Oc=");
_c = LoginModal;
var _c;
__turbopack_context__.k.register(_c, "LoginModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/AddEventModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddEventModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function AddEventModal(param) {
    let { open, onClose, onAdd } = param;
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()));
    const [startTime, setStartTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('09:00');
    const [endTime, setEndTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('10:00');
    const [importance, setImportance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('high');
    const handleAdd = ()=>{
        if (!name.trim()) {
            alert('Lütfen etkinlik adı girin');
            return;
        }
        if (!date) {
            alert('Lütfen tarih seçin');
            return;
        }
        if (!startTime || !endTime) {
            alert('Lütfen saat belirleyin');
            return;
        }
        if (startTime >= endTime) {
            alert('Bitiş saati başlangıçtan sonra olmalı');
            return;
        }
        const ev = {
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            name: name.trim(),
            date,
            startTime,
            endTime,
            importance,
            completed: false,
            postponeCount: 0,
            postponeHistory: [],
            originalDate: date,
            subTasks: [],
            parentId: null
        };
        onAdd(ev);
        setName('');
        setDate((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()));
        setStartTime('09:00');
        setEndTime('10:00');
        setImportance('high');
        onClose();
    };
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay active",
        id: "addEventModal",
        onClick: (e)=>{
            if (e.target === e.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal",
            style: {
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "modal-close",
                    onClick: onClose,
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "📅 Etkinlik Ekle"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Etkinlik Adı"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "Etkinlik adını girin",
                            value: name,
                            onChange: (e)=>setName(e.target.value),
                            autoFocus: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Tarih"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "date",
                            value: date,
                            onChange: (e)=>setDate(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Başlangıç Saati"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "time",
                            value: startTime,
                            onChange: (e)=>setStartTime(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Bitiş Saati"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "time",
                            value: endTime,
                            onChange: (e)=>setEndTime(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Önem Seviyesi"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "importance-selector",
                            children: [
                                'high',
                                'medium',
                                'low'
                            ].map((imp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "imp-option ".concat(imp === 'high' ? 'high' : imp === 'medium' ? 'med' : 'low').concat(importance === imp ? ' selected' : ''),
                                    onClick: ()=>setImportance(imp),
                                    children: imp === 'high' ? '🔴 Yüksek' : imp === 'medium' ? '🟠 Orta' : '🔵 Düşük'
                                }, imp, false, {
                                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/AddEventModal.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "modal-btn primary",
                    onClick: handleAdd,
                    children: "Etkinlik Ekle"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/AddEventModal.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/modals/AddEventModal.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/modals/AddEventModal.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(AddEventModal, "IHyymLzNatYRdgyNWO8eTJrR3Bw=");
_c = AddEventModal;
var _c;
__turbopack_context__.k.register(_c, "AddEventModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/DeleteModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeleteModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function DeleteModal(param) {
    let { open, eventName, onConfirm, onCancel } = param;
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay active",
        id: "deleteModal",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal",
            style: {
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "⚠️ Etkinliği Sil"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/DeleteModal.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "confirm-text",
                    children: [
                        "Bu etkinliği silmek istediğinize emin misiniz?",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/modals/DeleteModal.tsx",
                            lineNumber: 18,
                            columnNumber: 57
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: eventName
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/DeleteModal.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/DeleteModal.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "confirm-btns",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn danger",
                            onClick: onConfirm,
                            children: "Evet, Sil"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/DeleteModal.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn secondary",
                            onClick: onCancel,
                            children: "İptal"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/DeleteModal.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/DeleteModal.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/modals/DeleteModal.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/modals/DeleteModal.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = DeleteModal;
var _c;
__turbopack_context__.k.register(_c, "DeleteModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/PostponeReasonModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PostponeReasonModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const REASON_OPTIONS = [
    {
        value: 'too_big',
        emoji: '😰',
        label: 'Çok büyük/karmaşık'
    },
    {
        value: 'no_time',
        emoji: '⏰',
        label: 'Zamanım yetmedi'
    },
    {
        value: 'dont_know',
        emoji: '🤷',
        label: 'Nereden başlayacağımı bilmiyorum'
    },
    {
        value: 'no_energy',
        emoji: '😴',
        label: 'Enerjim yoktu'
    },
    {
        value: 'priorities',
        emoji: '🔄',
        label: 'Öncelikler değişti'
    },
    {
        value: 'other',
        emoji: '📝',
        label: 'Diğer'
    }
];
function PostponeReasonModal(param) {
    let { open, eventName, postponeCount, onConfirm, onCancel } = param;
    _s();
    const [selectedReason, setSelectedReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newDate, setNewDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()));
    const handleConfirm = ()=>{
        if (!selectedReason) {
            alert('Lütfen bir erteleme nedeni seçin');
            return;
        }
        if (!newDate) {
            alert('Lütfen yeni tarih seçin');
            return;
        }
        onConfirm(selectedReason, newDate);
        setSelectedReason('');
        setNewDate((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()));
    };
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay active",
        id: "postponeReasonModal",
        onClick: (e)=>{
            if (e.target === e.currentTarget) onCancel();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal pp-modal",
            style: {
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "modal-close",
                    onClick: onCancel,
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "🔄 Görevi Ertele"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "pp-task-name",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: eventName
                    }, void 0, false, {
                        fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                        lineNumber: 42,
                        columnNumber: 37
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                postponeCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pp-count-info",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "pp-warning-icon",
                            children: "⚠️"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this),
                        " Bu görev ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            className: "pp-count",
                            children: postponeCount
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 45,
                            columnNumber: 66
                        }, this),
                        ". kez erteleniyor!"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "pp-question",
                    children: "Neden erteliyorsun?"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pp-reason-options",
                    children: REASON_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pp-reason-option".concat(selectedReason === opt.value ? ' selected' : ''),
                            onClick: ()=>setSelectedReason(opt.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "pp-reason-emoji",
                                    children: opt.emoji
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: opt.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                                    lineNumber: 57,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, opt.value, true, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 51,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    style: {
                        marginTop: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: "Yeni Tarih"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "date",
                            value: newDate,
                            onChange: (e)=>setNewDate(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "confirm-btns",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn primary",
                            onClick: handleConfirm,
                            children: "🔄 Ertele & Taşı"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn secondary",
                            onClick: onCancel,
                            children: "İptal"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/modals/PostponeReasonModal.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(PostponeReasonModal, "tCAy2C53vSrf5vhVQHBcsw/F7BI=");
_c = PostponeReasonModal;
var _c;
__turbopack_context__.k.register(_c, "PostponeReasonModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/SplitTaskModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SplitTaskModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const HINT_SETS = [
    [
        'Araştırma yap',
        'Taslak hazırla',
        'İçerik yaz',
        'Son kontrol'
    ],
    [
        'Başlıkları belirle',
        'Ana kısmı yaz',
        'Detayları ekle',
        'Gözden geçir'
    ],
    [
        'Malzemeleri hazırla',
        'İlk adım',
        'Devam et',
        'Bitir'
    ]
];
function getHint(idx) {
    const set = HINT_SETS[Math.floor(Math.random() * HINT_SETS.length)];
    return set[idx] || "Adım ".concat(idx + 1);
}
function SplitTaskModal(param) {
    let { open, event, onConfirm, onCancel } = param;
    _s();
    const [inputs, setInputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        '',
        '',
        ''
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SplitTaskModal.useEffect": ()=>{
            if (!event) return;
            const [sh, sm] = event.startTime.split(':').map(Number);
            const [eh, em] = event.endTime.split(':').map(Number);
            const totalMin = eh * 60 + em - (sh * 60 + sm);
            const parts = totalMin > 90 ? 4 : totalMin > 60 ? 3 : 2;
            setInputs(Array(parts).fill(''));
        }
    }["SplitTaskModal.useEffect"], [
        event
    ]);
    if (!open || !event) return null;
    const [sh, sm] = event.startTime.split(':').map(Number);
    const [eh, em] = event.endTime.split(':').map(Number);
    const totalMin = eh * 60 + em - (sh * 60 + sm);
    const parts = inputs.length;
    const handleConfirm = ()=>{
        const names = inputs.map((s)=>s.trim()).filter(Boolean);
        if (names.length < 2) {
            alert('En az 2 alt görev girin');
            return;
        }
        onConfirm(inputs.map((s)=>s.trim()));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay active",
        id: "splitTaskModal",
        onClick: (e)=>{
            if (e.target === e.currentTarget) onCancel();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal pp-modal",
            style: {
                position: 'relative'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "modal-close",
                    onClick: onCancel,
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "✂️ Görevi Parçalara Böl"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "split-task-info",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "Ana görev: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: event.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "split-meta",
                            children: [
                                "⏱️ Süre: ",
                                totalMin,
                                " dk · 🔄 ",
                                event.postponeCount || 0,
                                "x ertelendi"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "split-suggestion",
                            children: [
                                parts,
                                " parçaya bölmeyi öneriyoruz (her biri ~",
                                Math.round(totalMin / parts),
                                " dk)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "split-subtask-list",
                    children: inputs.map((val, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "split-input-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "split-num",
                                    children: [
                                        i + 1,
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "split-subtask-input",
                                    placeholder: "Alt görev adı (ör: ".concat(getHint(i), ")"),
                                    value: val,
                                    onChange: (e)=>setInputs((prev)=>prev.map((v, j)=>j === i ? e.target.value : v))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this),
                                inputs.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "split-remove-btn",
                                    onClick: ()=>setInputs((prev)=>prev.filter((_, j)=>j !== i)),
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                                    lineNumber: 71,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "split-add-more",
                    onClick: ()=>setInputs((prev)=>[
                                ...prev,
                                ''
                            ]),
                    children: "+ Alt Görev Ekle"
                }, void 0, false, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "confirm-btns",
                    style: {
                        marginTop: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn primary",
                            onClick: handleConfirm,
                            children: "✂️ Parçalara Böl"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "modal-btn secondary",
                            onClick: onCancel,
                            children: "İptal"
                        }, void 0, false, {
                            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/modals/SplitTaskModal.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(SplitTaskModal, "z33spD5WYtH96rMN1eCWw0FFkbU=");
_c = SplitTaskModal;
var _c;
__turbopack_context__.k.register(_c, "SplitTaskModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/MedicineOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MedicineOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const FREQ_OPTIONS = [
    'Sabah',
    'Öğle',
    'Akşam'
];
const DAY_OPTIONS = [
    'Pzt',
    'Sal',
    'Çar',
    'Per',
    'Cum',
    'Cmt',
    'Paz'
];
function MedicineOverlay(param) {
    let { active, modState, onClose, onAdd, onDelete, onToggleTaken, currentWeekStart } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        dosage: '',
        startDate: '',
        duration: '',
        boxSize: '',
        remaining: ''
    });
    const [selectedFreq, setSelectedFreq] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDays, setSelectedDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const handleAdd = ()=>{
        if (!form.name || !form.dosage || !form.duration || !form.startDate) {
            alert('Lütfen tüm alanları doldurun');
            return;
        }
        if (selectedFreq.length === 0) {
            alert('En az bir zaman seçin');
            return;
        }
        if (selectedDays.length === 0) {
            alert('En az bir gün seçin');
            return;
        }
        const boxSize = parseInt(form.boxSize) || 0;
        const med = {
            id: 'med_' + Date.now(),
            name: form.name,
            dosage: form.dosage,
            frequency: selectedFreq,
            days: selectedDays,
            duration: parseInt(form.duration) || 0,
            boxSize,
            remaining: parseInt(form.remaining) || boxSize,
            startDate: form.startDate,
            takenLog: {}
        };
        onAdd(med);
        setForm({
            name: '',
            dosage: '',
            startDate: '',
            duration: '',
            boxSize: '',
            remaining: ''
        });
        setSelectedFreq([]);
        setSelectedDays([]);
    };
    const weekDates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(currentWeekStart);
    const toggleFreq = (val)=>setSelectedFreq((prev)=>prev.includes(val) ? prev.filter((v)=>v !== val) : [
                ...prev,
                val
            ]);
    const toggleDay = (val)=>setSelectedDays((prev)=>prev.includes(val) ? prev.filter((v)=>v !== val) : [
                ...prev,
                val
            ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "medicineOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "💊 İlaç Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card med-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "İlaçlarım"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 67,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "med-list",
                                        children: modState.medicines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#64748b',
                                                textAlign: 'center',
                                                padding: 20
                                            },
                                            children: "Henüz ilaç eklenmedi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, this) : modState.medicines.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "med-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "med-icon",
                                                        children: "💊"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 74,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "med-info",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "med-name",
                                                                children: m.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                                lineNumber: 76,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "med-detail",
                                                                children: [
                                                                    m.dosage,
                                                                    " • ",
                                                                    m.frequency.join(', '),
                                                                    " • ",
                                                                    m.days.join(', ')
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                                lineNumber: 77,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "med-detail",
                                                                children: [
                                                                    m.duration,
                                                                    " gün • Başlangıç: ",
                                                                    m.startDate
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                                lineNumber: 78,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "med-stock",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "count ".concat(m.remaining <= 5 ? 'low' : 'ok'),
                                                                children: m.remaining
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                                lineNumber: 81,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "stock-label",
                                                                children: "kalan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                                lineNumber: 82,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 80,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "med-delete",
                                                        onClick: ()=>onDelete(m.id),
                                                        children: "✕"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, m.id, true, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 73,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card med-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Yeni İlaç Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        'name:İlaç Adı:ör: Parol',
                                        'dosage:Dozaj:ör: 500mg'
                                    ].map((f)=>{
                                        const [key, label, ph] = f.split(':');
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "m-form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: ph,
                                                    value: form[key],
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                [key]: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Başlangıç Tarihi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 101,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: form.startDate,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            startDate: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 101,
                                                columnNumber: 74
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Kaç Gün"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 102,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "ör: 14",
                                                value: form.duration,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            duration: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 102,
                                                columnNumber: 65
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Kutu Boyutu (adet)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 103,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "ör: 30",
                                                value: form.boxSize,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            boxSize: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 103,
                                                columnNumber: 76
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Kalan İlaç"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 104,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "ör: 25",
                                                value: form.remaining,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            remaining: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 104,
                                                columnNumber: 68
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Ne Zaman Alınacak"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 106,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "freq-checks",
                                                children: FREQ_OPTIONS.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "freq-check".concat(selectedFreq.includes(v) ? ' active' : ''),
                                                        onClick: ()=>toggleFreq(v),
                                                        children: [
                                                            v === 'Sabah' ? '☀️' : v === 'Öğle' ? '🌤️' : '🌙',
                                                            " ",
                                                            v
                                                        ]
                                                    }, v, true, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 107,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Hangi Günler"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 116,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "day-checks",
                                                children: DAY_OPTIONS.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "day-check".concat(selectedDays.includes(v) ? ' active' : ''),
                                                        onClick: ()=>toggleDay(v),
                                                        children: v
                                                    }, v, false, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 119,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 117,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "m-btn success",
                                        onClick: handleAdd,
                                        style: {
                                            width: '100%'
                                        },
                                        children: "💊 İlaç Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-card med-accent",
                        style: {
                            marginTop: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Bu Haftaki İlaç Takvimi"
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "med-schedule-grid",
                                children: weekDates.map((d, i)=>{
                                    const dateStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(d);
                                    const dayName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_SHORT"][i];
                                    const medsForDay = modState.medicines.filter((m)=>m.days.includes(dayName));
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "med-sched-day",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "day-label",
                                                children: [
                                                    dayName,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 55
                                                    }, this),
                                                    d.getDate()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 135,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pills",
                                                children: medsForDay.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '0.65rem',
                                                        color: '#64748b'
                                                    },
                                                    children: "-"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 25
                                                }, this) : medsForDay.flatMap((m)=>m.frequency.map((f)=>{
                                                        var _m_takenLog_dateStr, _m_takenLog;
                                                        const taken = (_m_takenLog = m.takenLog) === null || _m_takenLog === void 0 ? void 0 : (_m_takenLog_dateStr = _m_takenLog[dateStr]) === null || _m_takenLog_dateStr === void 0 ? void 0 : _m_takenLog_dateStr.includes(f);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "med-pill".concat(taken ? ' taken' : ''),
                                                            onClick: ()=>onToggleTaken(m.id, dateStr, f),
                                                            children: [
                                                                m.name.substring(0, 6),
                                                                " (",
                                                                f.substring(0, 1).toUpperCase(),
                                                                ")"
                                                            ]
                                                        }, "".concat(m.id, "-").concat(f), true, {
                                                            fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 31
                                                        }, this);
                                                    }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                                lineNumber: 136,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, dateStr, true, {
                                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/MedicineOverlay.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(MedicineOverlay, "5QFMMkmJi/TCVDJBXch7S8WbnPU=");
_c = MedicineOverlay;
var _c;
__turbopack_context__.k.register(_c, "MedicineOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/WaterOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WaterOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function WaterOverlay(param) {
    let { active, modState, onClose, onAddWater, onSaveProfile } = param;
    var _modState_water_log_today, _modState_water_log_today1;
    _s();
    const [customAmount, setCustomAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        height: String(modState.water.height || ''),
        weight: String(modState.water.weight || ''),
        age: String(modState.water.age || ''),
        gender: modState.water.gender || 'male'
    });
    const [bmiResult, setBmiResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date());
    const consumed = ((_modState_water_log_today = modState.water.log[today]) === null || _modState_water_log_today === void 0 ? void 0 : _modState_water_log_today.total) || 0;
    const goal = modState.water.dailyGoal || 2500;
    const pct = Math.min(Math.round(consumed / goal * 100), 100);
    const entries = ((_modState_water_log_today1 = modState.water.log[today]) === null || _modState_water_log_today1 === void 0 ? void 0 : _modState_water_log_today1.entries) || [];
    const handleSaveProfile = ()=>{
        const h = parseFloat(profile.height) || 0;
        const w = parseFloat(profile.weight) || 0;
        const a = parseInt(profile.age) || 0;
        if (!h || !w || !a) {
            alert('Lütfen tüm bilgileri girin');
            return;
        }
        onSaveProfile(h, w, a, profile.gender);
        const bmi = (w / (h / 100 * (h / 100))).toFixed(1);
        const newGoal = Math.round((w * 35 + (profile.gender === 'male' ? 500 : 300)) / 100) * 100;
        setBmiResult("BMI: ".concat(bmi, " • Günlük Su Hedefi: ").concat(newGoal, " ml"));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "waterOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "💧 Su Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "module-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card water-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Günlük Su Durumu"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "water-visual",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'relative'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "water-bottle",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "water-bottle-neck"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                        lineNumber: 55,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "water-fill",
                                                        style: {
                                                            height: "".concat(pct, "%")
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                lineNumber: 54,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "water-stats",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "current",
                                                    children: [
                                                        (consumed / 1000).toFixed(1),
                                                        "L"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 60,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "goal",
                                                    children: [
                                                        "/ ",
                                                        (goal / 1000).toFixed(1),
                                                        "L"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 61,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "percent",
                                                    children: [
                                                        pct,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "water-quick-btns",
                                    children: [
                                        200,
                                        250,
                                        500,
                                        1000
                                    ].map((ml)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "water-add-btn",
                                            onClick: ()=>onAddWater(ml),
                                            children: [
                                                "+",
                                                ml >= 1000 ? '1L' : "".concat(ml, "ml")
                                            ]
                                        }, ml, true, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 8,
                                        marginTop: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            className: "water-custom-input",
                                            placeholder: "Özel miktar (ml)",
                                            style: {
                                                flex: 1,
                                                padding: '9px 12px',
                                                borderRadius: 10,
                                                border: '1px solid rgba(0,0,0,0.08)',
                                                background: '#f8fafc',
                                                color: '#1e293b',
                                                fontFamily: 'Inter',
                                                fontSize: '0.85rem'
                                            },
                                            value: customAmount,
                                            onChange: (e)=>setCustomAmount(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "m-btn primary",
                                            onClick: ()=>{
                                                const v = parseInt(customAmount) || 0;
                                                if (v > 0) {
                                                    onAddWater(v);
                                                    setCustomAmount('');
                                                }
                                            },
                                            children: "Ekle"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "water-history",
                                    style: {
                                        marginTop: 14
                                    },
                                    children: entries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: '#64748b',
                                            fontSize: '0.8rem',
                                            textAlign: 'center'
                                        },
                                        children: "Bugün henüz su içilmedi"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                        lineNumber: 85,
                                        columnNumber: 19
                                    }, this) : [
                                        ...entries
                                    ].reverse().map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "water-history-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "time",
                                                    children: e.time
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "amount",
                                                    children: [
                                                        "+",
                                                        e.amount,
                                                        "ml"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 87,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card water-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Vücut Bilgileri"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Boy (cm)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 97,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "ör: 175",
                                            value: profile.height,
                                            onChange: (e)=>setProfile((p)=>({
                                                        ...p,
                                                        height: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 97,
                                            columnNumber: 66
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Kilo (kg)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 98,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "ör: 75",
                                            value: profile.weight,
                                            onChange: (e)=>setProfile((p)=>({
                                                        ...p,
                                                        weight: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 98,
                                            columnNumber: 67
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Yaş"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 99,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "ör: 25",
                                            value: profile.age,
                                            onChange: (e)=>setProfile((p)=>({
                                                        ...p,
                                                        age: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 99,
                                            columnNumber: 61
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Cinsiyet"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 101,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: profile.gender,
                                            onChange: (e)=>setProfile((p)=>({
                                                        ...p,
                                                        gender: e.target.value
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "male",
                                                    children: "Erkek"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "female",
                                                    children: "Kadın"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "m-btn primary",
                                    onClick: handleSaveProfile,
                                    style: {
                                        width: '100%'
                                    },
                                    children: "Hesapla & Kaydet"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                bmiResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bmi-result",
                                    style: {
                                        display: 'block'
                                    },
                                    children: bmiResult
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                                    lineNumber: 108,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/modules/WaterOverlay.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/WaterOverlay.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(WaterOverlay, "er03mBYG/hE40QLUCyha7yEyr7Q=");
_c = WaterOverlay;
var _c;
__turbopack_context__.k.register(_c, "WaterOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/GymOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GymOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const GYM_TEMPLATES = [
    {
        name: 'Push/Pull/Legs',
        desc: 'Klasik 3 günlük program. İtme, çekme ve bacak günleri ile kasları hedefleyin.',
        badge: '3 Gün',
        exercises: [
            {
                id: '',
                day: 'Pzt',
                name: 'Bench Press',
                sets: 4,
                reps: 8,
                muscle: 'Göğüs'
            },
            {
                id: '',
                day: 'Pzt',
                name: 'Overhead Press',
                sets: 3,
                reps: 10,
                muscle: 'Omuz'
            },
            {
                id: '',
                day: 'Pzt',
                name: 'Tricep Pushdown',
                sets: 3,
                reps: 12,
                muscle: 'Tricep'
            },
            {
                id: '',
                day: 'Çar',
                name: 'Barbell Row',
                sets: 4,
                reps: 8,
                muscle: 'Sırt'
            },
            {
                id: '',
                day: 'Çar',
                name: 'Pull-up',
                sets: 3,
                reps: 10,
                muscle: 'Sırt'
            },
            {
                id: '',
                day: 'Çar',
                name: 'Bicep Curl',
                sets: 3,
                reps: 12,
                muscle: 'Bicep'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Squat',
                sets: 4,
                reps: 8,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Leg Press',
                sets: 3,
                reps: 10,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Calf Raise',
                sets: 4,
                reps: 15,
                muscle: 'Baldır'
            }
        ]
    },
    {
        name: 'Full Body',
        desc: 'Haftada 3 gün tüm vücudu çalıştıran başlangıç dostu program.',
        badge: '3 Gün • Başlangıç',
        exercises: [
            {
                id: '',
                day: 'Pzt',
                name: 'Squat',
                sets: 3,
                reps: 10,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Pzt',
                name: 'Bench Press',
                sets: 3,
                reps: 10,
                muscle: 'Göğüs'
            },
            {
                id: '',
                day: 'Çar',
                name: 'Deadlift',
                sets: 3,
                reps: 8,
                muscle: 'Sırt'
            },
            {
                id: '',
                day: 'Çar',
                name: 'Overhead Press',
                sets: 3,
                reps: 10,
                muscle: 'Omuz'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Leg Press',
                sets: 3,
                reps: 12,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Plank',
                sets: 3,
                reps: 30,
                muscle: 'Core'
            }
        ]
    },
    {
        name: 'Upper/Lower',
        desc: '4 günlük üst/alt beden bölünmesi. Orta seviye için ideal.',
        badge: '4 Gün • Orta',
        exercises: [
            {
                id: '',
                day: 'Pzt',
                name: 'Bench Press',
                sets: 4,
                reps: 8,
                muscle: 'Göğüs'
            },
            {
                id: '',
                day: 'Pzt',
                name: 'Barbell Row',
                sets: 4,
                reps: 8,
                muscle: 'Sırt'
            },
            {
                id: '',
                day: 'Sal',
                name: 'Squat',
                sets: 4,
                reps: 8,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Sal',
                name: 'Leg Curl',
                sets: 3,
                reps: 12,
                muscle: 'Hamstring'
            },
            {
                id: '',
                day: 'Per',
                name: 'Overhead Press',
                sets: 4,
                reps: 8,
                muscle: 'Omuz'
            },
            {
                id: '',
                day: 'Per',
                name: 'Pull-up',
                sets: 3,
                reps: 10,
                muscle: 'Sırt'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Front Squat',
                sets: 3,
                reps: 10,
                muscle: 'Bacak'
            },
            {
                id: '',
                day: 'Cum',
                name: 'Calf Raise',
                sets: 4,
                reps: 15,
                muscle: 'Baldır'
            }
        ]
    }
];
function GymOverlay(param) {
    let { active, modState, onClose, onAddExercise, onUseTemplate, onToggleExercise, onSetActiveProgram } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        muscle: '',
        sets: '3',
        reps: '10',
        day: 'Pzt'
    });
    const handleAddExercise = ()=>{
        if (!form.name || !form.muscle) {
            alert('Hareket adı ve kas grubu girin');
            return;
        }
        const ex = {
            id: 'ex_' + Date.now(),
            name: form.name,
            muscle: form.muscle,
            sets: parseInt(form.sets) || 3,
            reps: parseInt(form.reps) || 10,
            day: form.day
        };
        onAddExercise(ex);
        setForm((p)=>({
                ...p,
                name: '',
                muscle: ''
            }));
    };
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date());
    const todayDay = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAYS_SHORT"][new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const activeProgram = modState.gym.programs.find((p)=>p.id === modState.gym.activeProgram);
    const todayExercises = activeProgram ? activeProgram.exercises.filter((e)=>e.day === todayDay) : [];
    const logKey = today;
    const exerciseLog = modState.gym.exerciseLog;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "gymOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "🏋️ Gym Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card gym-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Programlarım"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "program-cards",
                                        id: "gymProgramCards",
                                        children: modState.gym.programs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.85rem'
                                            },
                                            children: "Henüz program eklenmedi. Şablonlardan birini seçin."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this) : modState.gym.programs.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "program-card".concat(modState.gym.activeProgram === p.id ? ' active' : ''),
                                                onClick: ()=>onSetActiveProgram(p.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "prog-name",
                                                        children: p.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "prog-days",
                                                        children: [
                                                            ...new Set(p.exercises.map((e)=>e.day))
                                                        ].join(', ')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "prog-count",
                                                        children: [
                                                            p.exercises.length,
                                                            " hareket"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, p.id, true, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 103,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card gym-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Hareket Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Hareket Adı"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 118,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "ör: Bench Press",
                                                value: form.name,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            name: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 118,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Kas Grubu"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 119,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "ör: Göğüs",
                                                value: form.muscle,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            muscle: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 119,
                                                columnNumber: 67
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "gym-form-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "m-form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Set"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: form.sets,
                                                        onChange: (e)=>setForm((p)=>({
                                                                    ...p,
                                                                    sets: e.target.value
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 63
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "m-form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Tekrar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: form.reps,
                                                        onChange: (e)=>setForm((p)=>({
                                                                    ...p,
                                                                    reps: e.target.value
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 66
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 122,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Gün"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: form.day,
                                                onChange: (e)=>setForm((p)=>({
                                                            ...p,
                                                            day: e.target.value
                                                        })),
                                                children: [
                                                    [
                                                        'Pzt',
                                                        'Pazartesi'
                                                    ],
                                                    [
                                                        'Sal',
                                                        'Salı'
                                                    ],
                                                    [
                                                        'Çar',
                                                        'Çarşamba'
                                                    ],
                                                    [
                                                        'Per',
                                                        'Perşembe'
                                                    ],
                                                    [
                                                        'Cum',
                                                        'Cuma'
                                                    ],
                                                    [
                                                        'Cmt',
                                                        'Cumartesi'
                                                    ],
                                                    [
                                                        'Paz',
                                                        'Pazar'
                                                    ]
                                                ].map((param)=>{
                                                    let [v, l] = param;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: v,
                                                        children: l
                                                    }, v, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "m-btn success",
                                        onClick: handleAddExercise,
                                        style: {
                                            width: '100%'
                                        },
                                        children: "➕ Hareket Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-card gym-accent",
                        style: {
                            marginTop: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Bugünkü Antrenman"
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "exercise-list",
                                id: "gymExerciseList",
                                children: !activeProgram ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        textAlign: 'center'
                                    },
                                    children: "Aktif program seçilmedi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                    lineNumber: 140,
                                    columnNumber: 17
                                }, this) : todayExercises.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        textAlign: 'center'
                                    },
                                    children: [
                                        "Bugün (",
                                        todayDay,
                                        ") antrenman yok"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                    lineNumber: 142,
                                    columnNumber: 19
                                }, this) : todayExercises.map((ex, i)=>{
                                    const key = "".concat(activeProgram.id, "_").concat(i);
                                    const done = !!exerciseLog[key];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "exercise-item".concat(done ? ' done' : ''),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ex-muscle",
                                                children: ex.muscle
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 148,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ex-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ex-name",
                                                        children: ex.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "ex-detail",
                                                        children: [
                                                            ex.sets,
                                                            " set × ",
                                                            ex.reps,
                                                            " tekrar"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 149,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "ex-check".concat(done ? ' checked' : ''),
                                                onClick: ()=>onToggleExercise(key),
                                                children: done ? '✓' : ''
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 153,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 147,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-card",
                        style: {
                            marginTop: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "📋 Hazır Program Şablonları"
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "template-cards",
                                children: GYM_TEMPLATES.map((tmpl, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "template-card",
                                        onClick: ()=>onUseTemplate(tmpl.exercises, tmpl.name),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "tmpl-name",
                                                children: [
                                                    "💪 ",
                                                    tmpl.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "tmpl-desc",
                                                children: tmpl.desc
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tmpl-badge",
                                                children: tmpl.badge
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/GymOverlay.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/GymOverlay.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/GymOverlay.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(GymOverlay, "FsmoihJHN29T2B+pDqQK3YM+Js8=");
_c = GymOverlay;
var _c;
__turbopack_context__.k.register(_c, "GymOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/BirthdayOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BirthdayOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const MONTH_NAMES = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
];
function getDaysUntil(dateStr) {
    const today = new Date();
    const [, month, day] = dateStr.split('-').map(Number);
    const next = new Date(today.getFullYear(), month - 1, day);
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
function BirthdayOverlay(param) {
    let { active, modState, onClose, onAdd, onDelete } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        date: '',
        giftIdea: '',
        giftPrice: '',
        giftBuyBy: ''
    });
    const [giftPlanned, setGiftPlanned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleAdd = ()=>{
        if (!form.name || !form.date) {
            alert('İsim ve tarih girin');
            return;
        }
        const bday = {
            id: 'bday_' + Date.now(),
            name: form.name,
            date: form.date,
            giftPlanned,
            giftIdea: form.giftIdea || undefined,
            giftPrice: form.giftPrice ? parseFloat(form.giftPrice) : undefined,
            giftBuyBy: form.giftBuyBy || undefined
        };
        onAdd(bday);
        setForm({
            name: '',
            date: '',
            giftIdea: '',
            giftPrice: '',
            giftBuyBy: ''
        });
        setGiftPlanned(false);
    };
    const sorted = [
        ...modState.birthdays
    ].sort((a, b)=>getDaysUntil(a.date) - getDaysUntil(b.date));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "birthdayOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "🎂 Doğum Günü Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "module-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card bday-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Yaklaşan Doğum Günleri"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bday-list",
                                    children: sorted.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: '#64748b',
                                            textAlign: 'center',
                                            padding: 20
                                        },
                                        children: "Henüz doğum günü eklenmedi"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this) : sorted.map((b)=>{
                                        const days = getDaysUntil(b.date);
                                        const [, month] = b.date.split('-').map(Number);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bday-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bday-avatar",
                                                    children: b.name[0].toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 65,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bday-info",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bday-name",
                                                            children: b.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                            lineNumber: 67,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bday-date",
                                                            children: MONTH_NAMES[month - 1]
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                            lineNumber: 68,
                                                            columnNumber: 25
                                                        }, this),
                                                        b.giftPlanned && b.giftIdea && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bday-gift",
                                                            children: [
                                                                "🎁 ",
                                                                b.giftIdea,
                                                                b.giftPrice ? " (".concat(b.giftPrice, "₺)") : ''
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                            lineNumber: 70,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 66,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bday-countdown",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "days",
                                                            children: days
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                            lineNumber: 74,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "label",
                                                            children: "gün"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                            lineNumber: 75,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 73,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bday-delete",
                                                    onClick: ()=>onDelete(b.id),
                                                    children: "✕"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 77,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, b.id, true, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 64,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card bday-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Doğum Günü Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Kişi Adı"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 86,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "ör: Ayşe",
                                            value: form.name,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        name: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 86,
                                            columnNumber: 66
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Doğum Tarihi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 87,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: form.date,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        date: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 87,
                                            columnNumber: 70
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            cursor: 'pointer'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: giftPlanned,
                                                onChange: (e)=>setGiftPlanned(e.target.checked)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, this),
                                            "Hediye Planla"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                        lineNumber: 89,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                giftPlanned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "m-form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Hediye Fikri"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 47
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "ör: Kitap",
                                                    value: form.giftIdea,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                giftIdea: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 74
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "m-form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Bütçe (₺)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 47
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    placeholder: "ör: 200",
                                                    value: form.giftPrice,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                giftPrice: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 71
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 97,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "m-form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Son Alım Tarihi"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 47
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: form.giftBuyBy,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                giftBuyBy: e.target.value
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 77
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                            lineNumber: 98,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "m-btn success",
                                    onClick: handleAdd,
                                    style: {
                                        width: '100%'
                                    },
                                    children: "🎂 Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/BirthdayOverlay.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(BirthdayOverlay, "IQuMErQ4G5QyS3ZY3dtxC2cP/SY=");
_c = BirthdayOverlay;
var _c;
__turbopack_context__.k.register(_c, "BirthdayOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/BudgetOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BudgetOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const CATEGORIES = [
    'Yiyecek',
    'Ulaşım',
    'Sağlık',
    'Eğlence',
    'Giyim',
    'Fatura',
    'Diğer'
];
function BudgetOverlay(param) {
    let { active, modState, onClose, onUpdateIncome, onAddExpense, onDeleteExpense, onAddShoppingList, onToggleShoppingItem } = param;
    _s();
    const [incomeInput, setIncomeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(modState.budget.income || ''));
    const [expForm, setExpForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        amount: '',
        category: 'Yiyecek',
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date())
    });
    const [listName, setListName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [listItems, setListItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const totalExpenses = modState.budget.expenses.reduce((s, e)=>s + e.amount, 0);
    const balance = modState.budget.income - totalExpenses;
    const handleSaveIncome = ()=>{
        const v = parseFloat(incomeInput) || 0;
        onUpdateIncome(v);
    };
    const handleAddExpense = ()=>{
        if (!expForm.name || !expForm.amount) {
            alert('Gider adı ve tutar girin');
            return;
        }
        const expense = {
            id: 'exp_' + Date.now(),
            name: expForm.name,
            amount: parseFloat(expForm.amount) || 0,
            category: expForm.category,
            date: expForm.date
        };
        onAddExpense(expense);
        setExpForm((p)=>({
                ...p,
                name: '',
                amount: ''
            }));
    };
    const handleAddList = ()=>{
        if (!listName) {
            alert('Liste adı girin');
            return;
        }
        const items = listItems.split('\n').map((s)=>s.trim()).filter(Boolean).map((text)=>({
                text,
                checked: false
            }));
        const list = {
            id: 'list_' + Date.now(),
            name: listName,
            date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()),
            items
        };
        onAddShoppingList(list);
        setListName('');
        setListItems('');
    };
    const byCategory = CATEGORIES.map((cat)=>({
            cat,
            total: modState.budget.expenses.filter((e)=>e.category === cat).reduce((s, e)=>s + e.amount, 0)
        })).filter((x)=>x.total > 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "budgetOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "💰 Bütçe Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card budget-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Genel Bakış"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "budget-summary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "budget-stat income",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-label",
                                                        children: "Gelir"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-value",
                                                        children: [
                                                            "₺",
                                                            modState.budget.income.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 77,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "budget-stat expense",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-label",
                                                        children: "Gider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-value",
                                                        children: [
                                                            "₺",
                                                            totalExpenses.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 81,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "budget-stat balance ".concat(balance >= 0 ? 'positive' : 'negative'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-label",
                                                        children: "Bakiye"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bs-value",
                                                        children: [
                                                            "₺",
                                                            balance.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        style: {
                                            marginTop: 16
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Aylık Gelir (₺)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: incomeInput,
                                                        onChange: (e)=>setIncomeInput(e.target.value),
                                                        style: {
                                                            flex: 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "m-btn primary",
                                                        onClick: handleSaveIncome,
                                                        children: "Kaydet"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 94,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    byCategory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 16
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    marginBottom: 8,
                                                    color: '#475569'
                                                },
                                                children: "Kategori Dağılımı"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, this),
                                            byCategory.map((param)=>{
                                                let { cat, total } = param;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '4px 0',
                                                        fontSize: '0.82rem',
                                                        borderBottom: '1px solid #f1f5f9'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: cat
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontWeight: 600
                                                            },
                                                            children: [
                                                                "₺",
                                                                total.toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                            lineNumber: 103,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, cat, true, {
                                                    fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 19
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-card budget-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Gider Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Açıklama"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 111,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "ör: Market alışverişi",
                                                value: expForm.name,
                                                onChange: (e)=>setExpForm((p)=>({
                                                            ...p,
                                                            name: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 111,
                                                columnNumber: 66
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Tutar (₺)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 112,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "ör: 150",
                                                value: expForm.amount,
                                                onChange: (e)=>setExpForm((p)=>({
                                                            ...p,
                                                            amount: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 112,
                                                columnNumber: 67
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Kategori"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: expForm.category,
                                                onChange: (e)=>setExpForm((p)=>({
                                                            ...p,
                                                            category: e.target.value
                                                        })),
                                                children: CATEGORIES.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: c,
                                                        children: c
                                                    }, c, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 38
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 115,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "m-form-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: "Tarih"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 119,
                                                columnNumber: 43
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: expForm.date,
                                                onChange: (e)=>setExpForm((p)=>({
                                                            ...p,
                                                            date: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 119,
                                                columnNumber: 63
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "m-btn success",
                                        onClick: handleAddExpense,
                                        style: {
                                            width: '100%'
                                        },
                                        children: "💸 Gider Ekle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-card budget-accent",
                        style: {
                            marginTop: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Son Giderler"
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "expense-list",
                                children: modState.budget.expenses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        textAlign: 'center',
                                        padding: 16
                                    },
                                    children: "Henüz gider eklenmedi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this) : [
                                    ...modState.budget.expenses
                                ].reverse().map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "expense-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "exp-cat-badge",
                                                children: e.category
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "exp-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "exp-name",
                                                        children: e.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "exp-date",
                                                        children: e.date
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 135,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "exp-amount",
                                                children: [
                                                    "₺",
                                                    e.amount.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "exp-delete",
                                                onClick: ()=>onDeleteExpense(e.id),
                                                children: "✕"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, e.id, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "module-card",
                        style: {
                            marginTop: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "🛒 Alışveriş Listeleri"
                            }, void 0, false, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "module-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "m-form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Liste Adı"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "ör: Haftalık Market",
                                                        value: listName,
                                                        onChange: (e)=>setListName(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 149,
                                                        columnNumber: 69
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 149,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "m-form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Ürünler (her satıra bir ürün)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        rows: 4,
                                                        placeholder: "Ekmek Süt Yumurta",
                                                        value: listItems,
                                                        onChange: (e)=>setListItems(e.target.value),
                                                        style: {
                                                            width: '100%',
                                                            padding: '8px 12px',
                                                            borderRadius: 10,
                                                            border: '1px solid rgba(0,0,0,0.08)',
                                                            background: '#f8fafc',
                                                            fontFamily: 'Inter',
                                                            fontSize: '0.85rem',
                                                            resize: 'vertical'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 150,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "m-btn primary",
                                                onClick: handleAddList,
                                                style: {
                                                    width: '100%'
                                                },
                                                children: "+ Liste Oluştur"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 160,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: modState.budget.shoppingLists.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.85rem'
                                            },
                                            children: "Henüz liste oluşturulmadı"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this) : modState.budget.shoppingLists.map((list)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "shopping-list-card",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sl-header",
                                                        children: [
                                                            list.name,
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.75rem',
                                                                    color: '#94a3b8'
                                                                },
                                                                children: list.date
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 60
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 21
                                                    }, this),
                                                    list.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "sl-item".concat(item.checked ? ' checked' : ''),
                                                            onClick: ()=>onToggleShoppingItem(list.id, idx),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "sl-check",
                                                                    children: item.checked ? '✓' : ''
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: item.text
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, list.id, true, {
                                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                                lineNumber: 167,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/BudgetOverlay.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(BudgetOverlay, "XThpCJdArpltHDkkH9v8wr6rItI=");
_c = BudgetOverlay;
var _c;
__turbopack_context__.k.register(_c, "BudgetOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/SleepOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SleepOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function calcDuration(sleepTime, wakeTime) {
    const [sh, sm] = sleepTime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let mins = wh * 60 + wm - (sh * 60 + sm);
    if (mins < 0) mins += 24 * 60;
    return Math.round(mins / 60 * 10) / 10;
}
function SleepOverlay(param) {
    let { active, modState, onClose, onAddLog } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date()),
        sleepTime: '23:00',
        wakeTime: '07:00'
    });
    const handleAdd = ()=>{
        const dur = calcDuration(form.sleepTime, form.wakeTime);
        const log = {
            id: 'sleep_' + Date.now(),
            date: form.date,
            sleepTime: form.sleepTime,
            wakeTime: form.wakeTime,
            duration: dur
        };
        onAddLog(log);
    };
    const recent = [
        ...modState.sleep.logs
    ].sort((a, b)=>b.date.localeCompare(a.date)).slice(0, 7);
    const avgDur = recent.length > 0 ? recent.reduce((s, l)=>s + l.duration, 0) / recent.length : 0;
    const goalMin = modState.sleep.goalMin;
    const goalMax = modState.sleep.goalMax;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "sleepOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "😴 Uyku Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "module-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card sleep-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Uyku Durumu"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sleep-stats",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sleep-stat",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-value",
                                                    children: avgDur > 0 ? avgDur.toFixed(1) : '--'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-label",
                                                    children: "Ort. Saat"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 55,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sleep-stat",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-value",
                                                    children: [
                                                        goalMin,
                                                        "-",
                                                        goalMax
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 58,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-label",
                                                    children: "Hedef"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 59,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sleep-stat",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-value",
                                                    children: recent.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "ss-label",
                                                    children: "Kayıt"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                    lineNumber: 63,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 61,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sleep-bars",
                                    style: {
                                        marginTop: 16
                                    },
                                    children: [
                                        recent.map((log)=>{
                                            const pct = Math.min(log.duration / (goalMax + 2) * 100, 100);
                                            const ok = log.duration >= goalMin && log.duration <= goalMax;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "sleep-bar-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "sleep-bar-date",
                                                        children: log.date.slice(5)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                        lineNumber: 72,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sleep-bar-track",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "sleep-bar-fill ".concat(ok ? 'good' : 'bad'),
                                                            style: {
                                                                width: "".concat(pct, "%")
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                            lineNumber: 74,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                        lineNumber: 73,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "sleep-bar-val",
                                                        children: [
                                                            log.duration,
                                                            "s"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                        lineNumber: 79,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, log.id, true, {
                                                fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                                lineNumber: 71,
                                                columnNumber: 19
                                            }, this);
                                        }),
                                        recent.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.85rem',
                                                textAlign: 'center'
                                            },
                                            children: "Henüz kayıt yok"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 83,
                                            columnNumber: 39
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card sleep-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Uyku Kaydı Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Tarih"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 88,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            value: form.date,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        date: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 88,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Uyuma Saati"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 89,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "time",
                                            value: form.sleepTime,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        sleepTime: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 89,
                                            columnNumber: 69
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Uyanma Saati"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 90,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "time",
                                            value: form.wakeTime,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        wakeTime: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 90,
                                            columnNumber: 70
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sleep-preview",
                                    children: [
                                        "Toplam: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                calcDuration(form.sleepTime, form.wakeTime),
                                                " saat"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                            lineNumber: 92,
                                            columnNumber: 23
                                        }, this),
                                        ' ',
                                        calcDuration(form.sleepTime, form.wakeTime) >= goalMin && calcDuration(form.sleepTime, form.wakeTime) <= goalMax ? '✅' : '⚠️'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "m-btn success",
                                    onClick: handleAdd,
                                    style: {
                                        width: '100%',
                                        marginTop: 12
                                    },
                                    children: "😴 Kaydet"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/modules/SleepOverlay.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/SleepOverlay.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(SleepOverlay, "e2BV/VRFnvHsUojbnBqNxev8sKo=");
_c = SleepOverlay;
var _c;
__turbopack_context__.k.register(_c, "SleepOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modules/GoalsOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GoalsOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const GOAL_ICONS = [
    '🎯',
    '📚',
    '🏃',
    '💪',
    '🧘',
    '🎨',
    '🎵',
    '💻',
    '✈️',
    '💰'
];
function GoalsOverlay(param) {
    let { active, modState, onClose, onAdd, onUpdateProgress, onDelete } = param;
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        target: '',
        unit: '',
        step: '1',
        icon: '🎯'
    });
    const handleAdd = ()=>{
        if (!form.name || !form.target || !form.unit) {
            alert('Hedef adı, değer ve birim girin');
            return;
        }
        const goal = {
            id: 'goal_' + Date.now(),
            name: form.name,
            target: parseFloat(form.target) || 1,
            current: 0,
            unit: form.unit,
            step: parseFloat(form.step) || 1,
            icon: form.icon
        };
        onAdd(goal);
        setForm({
            name: '',
            target: '',
            unit: '',
            step: '1',
            icon: '🎯'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "module-overlay".concat(active ? ' active' : ''),
        id: "goalsOverlay",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "🎯 Hedef Takibi"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "close-module",
                        onClick: onClose,
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "module-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "module-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card goals-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Hedeflerim"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                modState.goals.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#64748b',
                                        textAlign: 'center',
                                        padding: 20
                                    },
                                    children: "Henüz hedef eklenmedi"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this) : modState.goals.map((g)=>{
                                    const pct = Math.min(Math.round(g.current / g.target * 100), 100);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "goal-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "goal-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "goal-icon",
                                                        children: g.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 53,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "goal-info",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "goal-name",
                                                                children: g.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                                lineNumber: 55,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "goal-progress-text",
                                                                children: [
                                                                    g.current,
                                                                    " / ",
                                                                    g.target,
                                                                    " ",
                                                                    g.unit
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                                lineNumber: 56,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 54,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "goal-pct",
                                                        children: [
                                                            pct,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 58,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "goal-delete",
                                                        onClick: ()=>onDelete(g.id),
                                                        children: "✕"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 59,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                lineNumber: 52,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "goal-bar-track",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "goal-bar-fill",
                                                    style: {
                                                        width: "".concat(pct, "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                lineNumber: 61,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "goal-btns",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "goal-btn minus",
                                                        onClick: ()=>onUpdateProgress(g.id, -g.step),
                                                        children: [
                                                            "-",
                                                            g.step
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 65,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "goal-btn plus",
                                                        onClick: ()=>onUpdateProgress(g.id, g.step),
                                                        children: [
                                                            "+",
                                                            g.step
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                        lineNumber: 66,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                lineNumber: 64,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, g.id, true, {
                                        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                        lineNumber: 51,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "module-card goals-accent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Yeni Hedef Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "İkon Seç"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 6
                                            },
                                            children: GOAL_ICONS.map((icon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    onClick: ()=>setForm((p)=>({
                                                                ...p,
                                                                icon
                                                            })),
                                                    style: {
                                                        fontSize: '1.4rem',
                                                        cursor: 'pointer',
                                                        padding: '4px 8px',
                                                        borderRadius: 8,
                                                        background: form.icon === icon ? 'rgba(99,102,241,0.15)' : 'transparent',
                                                        border: form.icon === icon ? '2px solid #6366f1' : '2px solid transparent'
                                                    },
                                                    children: icon
                                                }, icon, false, {
                                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Hedef Adı"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 91,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "ör: Kitap oku",
                                            value: form.name,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        name: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 91,
                                            columnNumber: 67
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Hedef Değer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 92,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "ör: 12",
                                            value: form.target,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        target: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 92,
                                            columnNumber: 69
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Birim"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 93,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "ör: kitap, km, saat",
                                            value: form.unit,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        unit: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 93,
                                            columnNumber: 63
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "m-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: "Artış Adımı"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 94,
                                            columnNumber: 43
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            placeholder: "ör: 1",
                                            value: form.step,
                                            onChange: (e)=>setForm((p)=>({
                                                        ...p,
                                                        step: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                            lineNumber: 94,
                                            columnNumber: 69
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "m-btn success",
                                    onClick: handleAdd,
                                    style: {
                                        width: '100%'
                                    },
                                    children: "🎯 Hedef Ekle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/modules/GoalsOverlay.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(GoalsOverlay, "YMNxJpiVTC+lQUxyB+lXvci2xgI=");
_c = GoalsOverlay;
var _c;
__turbopack_context__.k.register(_c, "GoalsOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PlannerApp.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlannerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePlannerState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePlannerState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useModuleState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useModuleState.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/dateUtils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AppSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calendar/CalSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalMainHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calendar/CalMainHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalendarSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/calendar/CalendarSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$CompletionSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/sections/CompletionSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$PostponeSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/sections/PostponeSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$FAQSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/sections/FAQSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GuidedTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/GuidedTour.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/LoginModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$AddEventModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/AddEventModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$DeleteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/DeleteModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$PostponeReasonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/PostponeReasonModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$SplitTaskModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/SplitTaskModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$MedicineOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/MedicineOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$WaterOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/WaterOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$GymOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/GymOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$BirthdayOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/BirthdayOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$BudgetOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/BudgetOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$SleepOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/SleepOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$GoalsOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modules/GoalsOverlay.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function PlannerApp() {
    var _modules_modState_water_log_today, _planner_state_pendingReaddEvent, _planner_state_pendingReaddEvent1;
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const planner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePlannerState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlannerState"])();
    const modules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useModuleState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModuleState"])();
    const [activeModule, setActiveModule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeModal, setActiveModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showTour, setShowTour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Inbox bar computed values
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date());
    const todayEvents = planner.state.events.filter((e)=>e.date === today);
    const waterConsumed = ((_modules_modState_water_log_today = modules.modState.water.log[today]) === null || _modules_modState_water_log_today === void 0 ? void 0 : _modules_modState_water_log_today.total) || 0;
    const waterGoal = modules.modState.water.dailyGoal || 2500;
    const waterPct = Math.min(Math.round(waterConsumed / waterGoal * 100), 100);
    const lowMeds = modules.modState.medicines.filter((m)=>m.remaining <= 5);
    const upcomingBirthdays = modules.modState.birthdays.filter((b)=>{
        const [, month, day] = b.date.split('-').map(Number);
        const next = new Date(new Date().getFullYear(), month - 1, day);
        if (next < new Date()) next.setFullYear(new Date().getFullYear() + 1);
        return Math.ceil((next.getTime() - Date.now()) / 86400000) <= 7;
    });
    // Event click handling: complete if not in delete mode, else confirm delete
    const handleEventClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handleEventClick]": (id)=>{
            if (planner.state.deleteMode) {
                planner.setPendingDelete(id);
                setActiveModal('delete');
            } else {
                planner.toggleComplete(id);
            }
        }
    }["PlannerApp.useCallback[handleEventClick]"], [
        planner
    ]);
    // Postpone flow: event click → if event is being re-added, set pendingReadd → open postpone modal
    const handleReaddClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handleReaddClick]": (id)=>{
            const ev = planner.state.events.find({
                "PlannerApp.useCallback[handleReaddClick].ev": (e)=>e.id === id
            }["PlannerApp.useCallback[handleReaddClick].ev"]);
            if (!ev) return;
            planner.setPendingReadd(ev);
            setActiveModal('postpone');
        }
    }["PlannerApp.useCallback[handleReaddClick]"], [
        planner
    ]);
    // Split flow
    const handleSplitClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handleSplitClick]": (id)=>{
            const ev = planner.state.events.find({
                "PlannerApp.useCallback[handleSplitClick].ev": (e)=>e.id === id
            }["PlannerApp.useCallback[handleSplitClick].ev"]);
            if (!ev) return;
            planner.setPendingSplit(ev);
            setActiveModal('split');
        }
    }["PlannerApp.useCallback[handleSplitClick]"], [
        planner
    ]);
    const handlePostponeConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handlePostponeConfirm]": (reason, newDate)=>{
            if (!planner.state.pendingReaddEvent) return;
            planner.postponeEvent(planner.state.pendingReaddEvent.id, newDate, reason);
            setActiveModal(null);
        }
    }["PlannerApp.useCallback[handlePostponeConfirm]"], [
        planner
    ]);
    const handleSplitConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handleSplitConfirm]": (subTaskNames)=>{
            const orig = planner.state.pendingSplitEvent;
            if (!orig) return;
            const [sh, sm] = orig.startTime.split(':').map(Number);
            const [eh, em] = orig.endTime.split(':').map(Number);
            const totalMin = eh * 60 + em - (sh * 60 + sm);
            const partMin = Math.floor(totalMin / subTaskNames.length);
            const subEvents = subTaskNames.filter(Boolean).map({
                "PlannerApp.useCallback[handleSplitConfirm].subEvents": (name, i)=>{
                    const startMin = sh * 60 + sm + i * partMin;
                    const endMin = startMin + partMin;
                    const fmt = {
                        "PlannerApp.useCallback[handleSplitConfirm].subEvents.fmt": (m)=>"".concat(String(Math.floor(m / 60)).padStart(2, '0'), ":").concat(String(m % 60).padStart(2, '0'))
                    }["PlannerApp.useCallback[handleSplitConfirm].subEvents.fmt"];
                    return {
                        id: 'ev_' + Date.now() + '_' + i,
                        name,
                        date: orig.date,
                        startTime: fmt(startMin),
                        endTime: fmt(endMin),
                        importance: orig.importance,
                        completed: false,
                        postponeCount: 0,
                        postponeHistory: [],
                        originalDate: orig.date,
                        subTasks: [],
                        parentId: orig.id,
                        parentName: orig.name
                    };
                }
            }["PlannerApp.useCallback[handleSplitConfirm].subEvents"]);
            planner.splitEvent(orig.id, subEvents);
            setActiveModal(null);
        }
    }["PlannerApp.useCallback[handleSplitConfirm]"], [
        planner
    ]);
    const handleDeleteConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[handleDeleteConfirm]": ()=>{
            if (!planner.state.pendingDeleteId) return;
            planner.deleteEvent(planner.state.pendingDeleteId);
            setActiveModal(null);
        }
    }["PlannerApp.useCallback[handleDeleteConfirm]"], [
        planner
    ]);
    const getBirthdayBanners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlannerApp.useCallback[getBirthdayBanners]": (dateStr)=>{
            const [, , day] = dateStr.split('-').map(Number);
            return modules.modState.birthdays.filter({
                "PlannerApp.useCallback[getBirthdayBanners]": (b)=>{
                    const [, , bday] = b.date.split('-').map(Number);
                    return bday === day;
                }
            }["PlannerApp.useCallback[getBirthdayBanners]"]);
        }
    }["PlannerApp.useCallback[getBirthdayBanners]"], [
        modules.modState.birthdays
    ]);
    const pendingDeleteEvent = planner.state.pendingDeleteId ? planner.state.events.find((e)=>e.id === planner.state.pendingDeleteId) : null;
    // Determine which week dates to show
    const weekDates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$dateUtils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekDates"])(planner.state.currentWeekStart);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AppSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeModule: activeModule,
                onHome: ()=>setActiveModule(null),
                onModule: (mod)=>setActiveModule((prev)=>prev === mod ? null : mod),
                onAddEvent: ()=>setActiveModal('addEvent'),
                onRemoveEvent: planner.toggleDeleteMode,
                onProfile: ()=>setActiveModal('login'),
                deleteMode: planner.state.deleteMode,
                isLoggedIn: !!planner.state.user
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "main-area",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inbox-bar",
                        id: "inboxBar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inbox-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inbox-icon",
                                        children: "📅"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Bugün ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: todayEvents.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/PlannerApp.tsx",
                                                lineNumber: 159,
                                                columnNumber: 25
                                            }, this),
                                            " etkinlik"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PlannerApp.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inbox-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inbox-icon",
                                        children: "💧"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Su: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    waterPct,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/PlannerApp.tsx",
                                                lineNumber: 163,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PlannerApp.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            lowMeds.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inbox-item warning",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inbox-icon",
                                        children: "⚠️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: lowMeds.map((m)=>m.name).join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/PlannerApp.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this),
                                            " azalıyor"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PlannerApp.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            upcomingBirthdays.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inbox-item birthday",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inbox-icon",
                                            children: "🎂"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PlannerApp.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: b.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/PlannerApp.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 21
                                                }, this),
                                                " yakında!"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/PlannerApp.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, b.id, true, {
                                    fileName: "[project]/src/components/PlannerApp.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PlannerApp.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "content-area",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                currentWeekStart: planner.state.currentWeekStart,
                                events: planner.state.events,
                                onAddEvent: ()=>setActiveModal('addEvent')
                            }, void 0, false, {
                                fileName: "[project]/src/components/PlannerApp.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "calendar-area",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalMainHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        currentWeekStart: planner.state.currentWeekStart,
                                        onToday: planner.goToToday,
                                        onPrev: ()=>planner.navigateWeek(-1),
                                        onNext: ()=>planner.navigateWeek(1),
                                        onTour: ()=>setShowTour(true),
                                        onAddEvent: ()=>setActiveModal('addEvent')
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$calendar$2f$CalendarSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        currentWeekStart: planner.state.currentWeekStart,
                                        events: planner.state.events,
                                        deleteMode: planner.state.deleteMode,
                                        onEventClick: handleEventClick,
                                        onDeleteEvent: (id)=>{
                                            planner.setPendingDelete(id);
                                            setActiveModal('delete');
                                        },
                                        getBirthdayBanners: getBirthdayBanners
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$CompletionSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        events: planner.state.events,
                                        currentWeekStart: planner.state.currentWeekStart,
                                        onReadd: handleReaddClick
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$PostponeSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        events: planner.state.events,
                                        onSplit: handleSplitClick
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$sections$2f$FAQSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/components/PlannerApp.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PlannerApp.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PlannerApp.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$LoginModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: activeModal === 'login',
                user: planner.state.user,
                onClose: ()=>setActiveModal(null),
                onLogin: planner.login,
                onLogout: planner.logout
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$AddEventModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: activeModal === 'addEvent',
                onClose: ()=>setActiveModal(null),
                onAdd: (ev)=>{
                    planner.addEvent(ev);
                    setActiveModal(null);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 230,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$DeleteModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: activeModal === 'delete',
                eventName: (pendingDeleteEvent === null || pendingDeleteEvent === void 0 ? void 0 : pendingDeleteEvent.name) || '',
                onConfirm: handleDeleteConfirm,
                onCancel: ()=>{
                    planner.setPendingDelete(null);
                    setActiveModal(null);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$PostponeReasonModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: activeModal === 'postpone',
                eventName: ((_planner_state_pendingReaddEvent = planner.state.pendingReaddEvent) === null || _planner_state_pendingReaddEvent === void 0 ? void 0 : _planner_state_pendingReaddEvent.name) || '',
                postponeCount: ((_planner_state_pendingReaddEvent1 = planner.state.pendingReaddEvent) === null || _planner_state_pendingReaddEvent1 === void 0 ? void 0 : _planner_state_pendingReaddEvent1.postponeCount) || 0,
                onConfirm: handlePostponeConfirm,
                onCancel: ()=>{
                    planner.setPendingReadd(null);
                    setActiveModal(null);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$SplitTaskModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: activeModal === 'split',
                event: planner.state.pendingSplitEvent,
                onConfirm: handleSplitConfirm,
                onCancel: ()=>{
                    planner.setPendingSplit(null);
                    setActiveModal(null);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$MedicineOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'medicine',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAdd: modules.addMedicine,
                onDelete: modules.deleteMedicine,
                onToggleTaken: modules.toggleMedTaken,
                currentWeekStart: planner.state.currentWeekStart
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$WaterOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'water',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAddWater: modules.addWater,
                onSaveProfile: modules.saveWaterProfile
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$GymOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'gym',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAddExercise: modules.addExercise,
                onUseTemplate: _s1((exercises, name)=>{
                    _s1();
                    return modules.useGymTemplate(exercises, name);
                }, "OKqLjTzWN6Lv2uecoH0r1KeE0Fg=", false, function() {
                    return [
                        modules.useGymTemplate
                    ];
                }),
                onToggleExercise: modules.toggleExercise,
                onSetActiveProgram: (id)=>modules.save({
                        ...modules.modState,
                        gym: {
                            ...modules.modState.gym,
                            activeProgram: id
                        }
                    })
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$BirthdayOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'birthday',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAdd: modules.addBirthday,
                onDelete: modules.deleteBirthday
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$BudgetOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'budget',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onUpdateIncome: modules.updateIncome,
                onAddExpense: modules.addExpense,
                onDeleteExpense: modules.deleteExpense,
                onAddShoppingList: modules.addShoppingList,
                onToggleShoppingItem: modules.toggleShoppingItem
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$SleepOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'sleep',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAddLog: modules.addSleepLog
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modules$2f$GoalsOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: activeModule === 'goals',
                modState: modules.modState,
                onClose: ()=>setActiveModule(null),
                onAdd: modules.addGoal,
                onUpdateProgress: modules.updateGoalProgress,
                onDelete: modules.deleteGoal
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$GuidedTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                active: showTour,
                onEnd: ()=>setShowTour(false)
            }, void 0, false, {
                fileName: "[project]/src/components/PlannerApp.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PlannerApp.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_s(PlannerApp, "DWlc5BJiwn/CDsYv5mQYIMb1s0s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePlannerState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlannerState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useModuleState$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModuleState"]
    ];
});
_c = PlannerApp;
var _c;
__turbopack_context__.k.register(_c, "PlannerApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_09e9717a._.js.map