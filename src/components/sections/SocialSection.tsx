const items = [
  { label: "Social Media", value: "@lexanddavidstudio" },
  { label: "Contact", value: "hello@lexanddavidstudio.com" },
  { label: "Number", value: "9636051115" },
  { label: "", value: "lexanddavidstudio.com" },
];

const SocialSection = () => {
  return (
    <section className="w-full pt-20 h-full bg-[#e9e9e6] overflow-x-hidden">
      <div className="max-w-site mx-auto">
        {items.map((item, index) => (
          <button
            key={index}
            className="group w-full border-b border-black/20 px-4 gap-1 py-2 flex flex-col md:flex-row md:items-center justify-center text-left"
          >
            <span className="text-power font-secondary text-black/60 mb-2 pb-5 md:mb-0">
              {item.label}
            </span>
            <h1
              className="text-subhead font-mono lowercase
                transition-transform break-words duration-300
                group-hover:translate-x-5"
            >
              {item.value}
            </h1>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SocialSection;
