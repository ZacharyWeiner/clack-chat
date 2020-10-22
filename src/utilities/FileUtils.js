export default class FileUtils {
  static async importFromPublic(fileName) {
    console.log(process.env.BASE_URL + "contracts/" + fileName);
    const response = await fetch(
      process.env.BASE_URL + "contracts/" + fileName
    );
    return response.text();
  }
}
