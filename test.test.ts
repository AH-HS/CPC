import { it, test } from "node:test";
import { CPC } from "./src";
import assert from "node:assert";

const basic = CPC(
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
);
test("基本测试1", () => {
    assert.equal(
        "rounded w-[100px] h-[100px] text-black bg-white"
            .split(" ")
            .every((c) =>
                basic({ size: "big", theme: "dark" }).split(" ").includes(c)
            ),
        true
    );
});

test("基准测试2", () => {
    assert.equal(
        "rounded w-[100px] h-[100px] text-[#ff5566] bg-[#11ff66]"
            .split(" ")
            .every((c) =>
                basic({ size: "big", theme: "color" }).split(" ").includes(c)
            ),
        true
    );
});
