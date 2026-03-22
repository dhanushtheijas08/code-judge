function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const parseKeyValueData = (data: unknown) => {
  if (isObject(data)) {
    const validObj = data;
    const keys = Object.keys(validObj);
    const resultArr = keys.map((key) => ({
      label: key,
      value: validObj[key] ?? null,
    }));
    return resultArr;
  } else if (Array.isArray(data)) {
    const firstVal = data[0];
    if (typeof firstVal === "number") {
      return [{ label: "nums", value: data }];
    } else if (typeof firstVal === "string") {
      return [{ label: "strs", value: data }];
    } else {
      return [{ label: "vals", value: data }];
    }
  } else {
    if (typeof data === "number") {
      return [{ label: "num", value: data }];
    } else if (typeof data === "string") {
      return [{ label: "str", value: data }];
    } else {
      return [{ label: "vals", value: data }];
    }
  }
};
