const DangerZone = () => {
  return (
    <div
      className="
        rounded-xl border
        border-red-500/30
        bg-gradient-to-r from-red-500/5 to-transparent
        p-6
      "
    >
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-red-500">
          Danger Zone
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Irreversible and destructive actions.
        </p>
      </div>

      {/* Content */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="max-w-md">
          <h6 className="font-medium text-gray-900 dark:text-white">
            Delete Account
          </h6>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Permanently delete your account and all associated data.
            This action cannot be undone.
          </p>
        </div>

        <button
          aria-label="Delete account permanently"
          className="
            px-5 py-2.5 rounded-md
            text-sm font-medium
            text-red-600
            border border-red-500/40
            hover:bg-red-500 hover:text-white
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500/40 cursor-pointer
          "
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DangerZone;
