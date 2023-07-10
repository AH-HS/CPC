type PresetsType = Record<string, Record<string, string>>;

type getSets<T extends PresetsType> = {
    [k in keyof T]?: keyof T[k];
};

type Cpc = <T extends PresetsType>(
    presets: T,
    base?: string
) => (sets: getSets<T>, hightLevelClass?: Record<string, string>) => string;

export const CPC: Cpc = (preset, base) => (sets, hightLevelClass) => {
    const _base = base ? base + " " : "";
    const out =
        _base +
        Object.keys(sets)
            .map((set) => preset[set][sets[set] as string] as string)
            .join(" ");
    if (hightLevelClass) {
        const classNames = Object.keys(hightLevelClass);
        if (classNames.length === 0) return out;
        const changeClass = classNames.map((className) =>
            className.replaceAll(/(\[|\])/g, (match) => {
                if (match === "[") return "\\[";
                if (match === "]") return "\\]";
                return "";
            })
        );

        const pattern = new RegExp(`(${changeClass.join("|")})`, "g");
        return out.replaceAll(pattern, (match) => hightLevelClass[match]);
    }
    return out;
};
