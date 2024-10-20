export const csvToJson = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');
  
      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index] ? currentLine[index].trim() : null;
      });
  
      if (Object.keys(obj).length > 0) {
        result.push(obj);
      }
    }
  
    return result;
  };
  