type PresetsType = Record<string, Record<string, string>>;

type getSets<T extends PresetsType> = {
    [k in keyof T]?: keyof T[k];
};

type Cpc = <T extends PresetsType>(
    presets: T,
    base?: string
) => (sets: getSets<T>, hightLevelClass?: Record<string, string>) => string;

/**
 * @param presets 预设的不同状态下的样式
 * @param base 不同状态共有的样式
 * @returns 返沪一个函数可以根据配置返回计算后的class,并能够覆盖原有配置的class
 * ```tsx
 * const basic = CPC(
    {
        size: {
            big: "w-[100px] h-[100px]",
            mid: "w-[50px] h-[50px]",
            mini: "w-[20px] h-[20px]",
        },
        theme: {
            dark: "text-black bg-white",
            color: "text-[#ff5566] bg-[#11ff66]",
        },
    },
    "rounded"
)
 * 
 * <Component className={basic({ size: "big", theme: "dark" })} /> 
 * --> className = 'w-[100px] h-[100px] text-black bg-white'
 * ```
 */
export const CPC: Cpc = (presets, base) => (config, hightLevelClass) => {
    const _base = base ? base + " " : "";
    const out = _base + getBaseClassByConfig(presets, config);
    if (hightLevelClass) return replaceClass(out, hightLevelClass);
    return out;
};

/**
 * 根据状态配置返回状态组合后的class
 */
const getBaseClassByConfig = <T extends PresetsType>(
    presets: T,
    config: getSets<T>
) =>
    Object.keys(config)
        .map((configKey) => presets[configKey][config[configKey] as string])
        .join(" ");

const getReplaceClass = (replaceConfig: Record<string, string>) =>
    Object.keys(replaceConfig).map((className) =>
        className.replaceAll(/(\[|\])/g, (match) => {
            if (match === "[") return "\\[";
            if (match === "]") return "\\]";
            return "";
        })
    );
const replaceClass = (
    baseClass: string,
    replaceConfig: Record<string, string>
) => {
    const replaceClass = getReplaceClass(replaceConfig);
    if (replaceClass.length === 0) return baseClass;
    const pattern = new RegExp(`(${replaceClass.join("|")})`, "g");
    return baseClass.replaceAll(pattern, (match) => replaceConfig[match]);
};
