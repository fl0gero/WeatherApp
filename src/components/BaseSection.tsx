type BaseSectionProps = {
  title: string;
  value?: number | string;
  measurement?: string;
  description?: string;
};

export const BaseSection = ({
  title,
  value,
  description,
  measurement,
}: BaseSectionProps) => {
  return (
    <section className="col-span-1 row-span-1  rounded-lg bg-white bg-opacity-5 p-3">
      <h3 className="w-fit opacity-50">{title}</h3>
      <h1 className="mt-4 w-fit text-5xl">
        {value ? Math.round(Number(value)) : null}
        {value ? measurement : null}
      </h1>
      {description ? <h2 className="w-fit">{description}</h2> : null}
    </section>
  );
};
