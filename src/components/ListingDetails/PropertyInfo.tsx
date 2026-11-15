type PropertyInfoProps = {
  title: string;
  description: string | null;
  price: number | null;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
};

export default function PropertyInfo({
  title,
  description,
  price,
  location,
}: PropertyInfoProps) {
  const formattedPrice =
    price !== null
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(price)
      : "Price unavailable";

  const hasCoordinates =
    location?.latitude != null && location?.longitude != null;

  return (
    <section className="relative z-10 -mt-8 space-y-7 rounded-t-[32px] bg-white px-5 py-7">

      {/* TITLE AND LOCATION */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {location?.address ?? "Location unavailable"}
        </p>
      </div>

      {/* PRICE */}
      <div>
        <p className="text-sm text-slate-500">Starting Price</p>

        <h2 className="mt-1 text-2xl font-bold text-[#1C2216]">
          {formattedPrice}
        </h2>
      </div>

      {/* DESCRIPTION */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          About Property
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {description || "No property description available."}
        </p>
      </div>

      {/* MAP */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Location
        </h2>

        {hasCoordinates ? (
          <div className="overflow-hidden rounded-2xl">
            <iframe
              title="Property Location Map"
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`}
              width="100%"
              height="220"
              loading="lazy"
              className="border-0"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex h-[180px] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
            Map location unavailable
          </div>
        )}
      </div>

    </section>
  );
}