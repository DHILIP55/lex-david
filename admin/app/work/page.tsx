"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import StickyNavbar from "@/components/site/layout/StickyNavbar";
import Footer from "@/components/site/layout/Footer";
import { fetchApi } from "@/utils/api";

type Project = { _id: string; title: string; slug: string; coverImageUrl: string; gridLayout: "full" | "half"; order: number; isPublished: boolean; category: string; description: string };

const ImageCard = ({ project, full }: { project: Project; full?: boolean }) => (
  <div className={`relative w-full ${full ? "h-[300px] md:h-[450px]" : "h-[300px]"}`}>
    {project.coverImageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover rounded-2xl" />
    ) : (
      <div className="w-full h-full bg-black/10 rounded-2xl flex items-center justify-center">
        <span className="font-primary text-subhead uppercase tracking-widest text-black/30">{project.title}</span>
      </div>
    )}
    <Link href={`/detail/${project.slug}`} className="absolute bottom-4 left-4 bg-black text-white text-center text-body font-mono md:px-4 md:pt-2 md:pb-2 px-[6px] py-[4px] rounded-full hover:bg-white hover:text-black transition">Show More</Link>
  </div>
);

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/projects?published=true").then((data) => {
      setProjects(data as Project[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const renderGrid = () => {
    const items: React.ReactNode[] = [];
    let i = 0;
    while (i < projects.length) {
      const p = projects[i];
      const next = projects[i + 1];

      if (p.gridLayout === "half") {
        if (next && next.gridLayout === "half") {
          items.push(
            <div key={p._id + next._id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageCard project={p} />
              <ImageCard project={next} />
            </div>
          );
          i += 2;
        } else {
          items.push(
            <div key={p._id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageCard project={p} />
              <div className="h-[300px] bg-white rounded-2xl border border-black/5" />
            </div>
          );
          i++;
        }
      } else {
        items.push(<ImageCard key={p._id} project={p} full />);
        i++;
      }
    }
    return items;
  };

  if (loading) return (
    <>
      <StickyNavbar />
      <div className="w-full px-4 md:px-10 lg:px-20 py-10 space-y-10 animate-pulse">
        <div className="max-w-3xl space-y-4">
          <div className="h-10 w-40 bg-black/10 rounded" />
          <div className="h-4 w-80 bg-black/10 rounded" />
        </div>
        <div className="space-y-6">
          <div className="h-[450px] w-full bg-black/10 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px] bg-black/10 rounded-2xl" />
            <div className="h-[300px] bg-black/10 rounded-2xl" />
          </div>
          <div className="h-[450px] w-full bg-black/10 rounded-2xl" />
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <StickyNavbar />
      <div className="w-full bg-white/10 px-4 md:px-10 lg:px-20 py-10 space-y-10">
        <div className="max-w-3xl">
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">Our Work</h1>
          <p className="mt-4 text-black/90 font-secondary text-body">Explore our latest projects showcasing creativity, design, and innovation.</p>
        </div>
        <div className="space-y-6">
          {projects.length === 0 ? <p className="text-black/40 font-secondary text-body">No projects yet.</p> : renderGrid()}
        </div>
      </div>
      <Footer />
    </>
  );
}
