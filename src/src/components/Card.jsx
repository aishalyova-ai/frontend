export default function Card({ children, className }) {
  return (
    <div className={\`bg-white p-6 rounded shadow-md \${className || ""}\`}>
      {children}
    </div>
  );
}
