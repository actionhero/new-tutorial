export const DEFAULT = {
  routes: (config) => {
    return {
      get: [
        { path: "/tasks", action: "task:list" },
        { path: "/tasks/:taskId", action: "task:get" },
      ],
      post: [{ path: "/tasks", action: "task:create" }],
      patch: [{ path: "/tasks/:taskId", action: "task:update" }],
      delete: [{ path: "/tasks/:taskId", action: "task:delete" }],
    };
  },
};
