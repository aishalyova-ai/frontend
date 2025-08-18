export default function Label({ children, ...props }) {
  return (
    <label className="block mb-1 font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
}
