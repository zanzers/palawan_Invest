const trim = (x: number) => String(Math.round(x * 10) / 10);

export function formatPrice(n: number | null): string{

    switch(true){

        case n === null:
            return "On Request"
        case n! >= 1_000_000:
            return  `₱${trim(n / 1_000_000)}M`;
        case n! >= 1_000:
            return  `₱${trim(n / 1_000)}K`;
        default:
            return `₱${n.toLocaleString("en-PH")}`;
    }

}

