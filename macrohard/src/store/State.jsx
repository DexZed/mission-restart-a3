import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { BehaviorSubject, catchError, from, map, of, switchMap } from "rxjs";
import { useDatabase } from "../database/LocalDB";

function appReducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, loading: true, error: null };
    case "SUCCESS":
      return { ...state, loading: false, data: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const dataRequest$ = new BehaviorSubject(undefined);
export const AppContext = createContext(null);

export function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: [],
    loading: false,
    error: null,
  });
  const { data: dbData, addItem } = useDatabase();

  const syncData = useMemo(() => {
    return state.data.map((item) => {
      const dbItem = dbData.find((dbItem) => dbItem.id === item.id);
      if (dbItem) {
        return { ...item, ...dbItem };
      }
      return item;
    });
  }, [state.data, dbData]);

  useEffect(() => {
    const subscription = dataRequest$
      .pipe(
        map(() => dispatch({ type: "START" })),

        switchMap(() =>
          from(fetch("./data.json").then((res) => res.json())).pipe(
            map((data) => dispatch({ type: "SUCCESS", payload: data })),
            catchError((err) => {
              dispatch({ type: "ERROR", payload: err.message });
              return of(null);
            }),
          ),
        ),
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({
      state: { ...state, data: syncData },
      refresh: () => dataRequest$.next(),
    }),
    [state, syncData, addItem],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppContextProvider");
  }
  return context;
}

export default AppContextProvider;
