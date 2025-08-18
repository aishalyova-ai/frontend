export default function Select({ children, ...props }) {
  return (
    <select
      className="w-full px-3 py-2 border rounded"
      {...props}
    >
      {children}
    </select>
  );
}
