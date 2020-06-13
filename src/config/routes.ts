export const DEFAULT = {
  routes: (config) => {
    return {
      get: [
        { path: "/goals", action: "goal:list" },
        { path: "/goals/:id", action: "goal:get" },
      ],
      post: [{ path: "/goals", action: "goal:create" }],
      patch: [{ path: "/goals/:id", action: "goal:update" }],
      delete: [{ path: "/goals/:id", action: "goal:delete" }],
    };
  },
};
