import Image from "next/image";

interface MiniArticleCardProps {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
}
export default function MiniArticleCard({
  image,
  category,
  title,
  author,
  date,
}: MiniArticleCardProps) {
  return (
    <div className="group relative h-full">
      {" "}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:border-gray-300 bg-white w-full cursor-pointer h-full">
        {" "}
        <div className="relative w-28 flex-shrink-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>{" "}
        <div className="flex flex-col justify-center p-2 flex-1 min-w-0">
          {" "}
          <span className="text-xs text-gray-500 font-medium mb-1">
            {" "}
            {category}{" "}
          </span>{" "}
          <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-tight mb-1 transition-colors duration-300 line-clamp-2 group-hover:line-clamp-none">
            {" "}
            {title}{" "}
          </h3>{" "}
          <p className="text-gray-500 text-[10px]">
            {" "}
            {author} • {date}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
