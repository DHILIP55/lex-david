// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        <h1 className="text-xl font-bold">SHARE</h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">LinkedIn</a>
        </div>

        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} SHARE Intensive
        </p>
      </div>
    </footer>
  );
}