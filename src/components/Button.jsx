export default function Button({ children, ...props }) {
  return (
    <button
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
