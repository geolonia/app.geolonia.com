export const readFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target && e.target.result ? (e.target.result as string) : "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
