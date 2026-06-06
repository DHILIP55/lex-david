import { Link } from "react-router-dom";

export default function CoursesSection() {
  return (
    <section className="bg-black h-screen text-white py-20 px-6 text-center">
      <div className="max-w-site mx-auto flex flex-col items-center justify-center h-full">
        <h2 className="text-head font-primary mb-6">OUR WORK</h2>
        <p className="max-w-2xl font-secondary mx-auto text-body text-gray-300 mb-8">
          Become part of a global network of dancers and creatives.
          Get exclusive access to programs, events, and collaborations.
        </p>
        <Link
          to="/work"
          className="bg-white font-secondary text-black px-8 py-3 rounded-md text-body font-medium"
        >
          Our Work Details
        </Link>
      </div>
    </section>
  );
}
