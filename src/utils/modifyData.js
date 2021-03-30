export function modifyData(data) {
  const newData = [];
  const unzipData = data.val();
  for (let key in data.val()) {
    newData.push({
      id: key,
      value: unzipData[key]
    });
  }
  return newData;
}
