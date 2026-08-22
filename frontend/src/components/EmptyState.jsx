const EmptyState = ({ message = "Nothing here yet." }) => (
  <div className="text-center py-16 text-gray-400">
    <p className="text-4xl mb-2">🗒️</p>
    <p>{message}</p>
  </div>
);

export default EmptyState;
