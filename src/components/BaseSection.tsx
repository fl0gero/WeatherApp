import { ReactNode } from "react";

type BaseSectionProps = {
  title: string;
  value?: number | string;
  measurement?: string;
  description?: string;
  children?: ReactNode;
};

export const BaseSection = ({
  title,
  value,
  description,
  measurement,
  children,
}: BaseSectionProps) => {
  return (
    <section className="relative col-span-1 row-span-1 rounded-lg bg-white bg-opacity-10 p-3">
      <h3 className="w-fit opacity-50">{title}</h3>
      <h1 className="mt-4 w-fit text-5xl">
        {value !== undefined
          ? typeof value == "string"
            ? value
            : Math.round(value)
          : null}
        {value ? measurement : null}
      </h1>
      {description ? <h2 className="w-fit">{description}</h2> : null}
      {children ? children : null}
    </section>
  );
};
