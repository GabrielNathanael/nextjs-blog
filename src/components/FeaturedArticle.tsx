interface FeaturedArticleProps {
  image: string;
  category: string;
  title: string;
  author: string;
  date: string;
}
export default function FeaturedArticle({
  image,
  category,
  title,
  author,
  date,
}: FeaturedArticleProps) {
  return (
    <div className="group relative">
      {" "}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-gray-300 bg-white w-full cursor-pointer">
        {" "}
        <img
          src={image}
          alt={title}
          className="w-full lg:w-2/5 h-64 lg:h-80 object-cover"
        />{" "}
        <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
          {" "}
          <span className="text-xs md:text-sm text-gray-500 font-medium mb-2 lg:mb-3">
            {" "}
            {category}{" "}
          </span>{" "}
          <h2 className="text-base md:text-xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight transition-colors duration-300 line-clamp-2 group-hover:line-clamp-none">
            {" "}
            {title}{" "}
          </h2>{" "}
          <p className="text-gray-500 text-xs md:text-sm">
            {" "}
            {author} • {date}{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
