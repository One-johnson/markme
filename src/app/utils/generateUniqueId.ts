export function generateClassId(name: string): string {
  const match = name.match(/^([A-Za-z]+)\s(\d+)$/); // Matches strings like "Basic 1"
  if (!match) {
    throw new Error("Invalid class name format");
  }
  const classPrefix = `${match[1].charAt(0).toUpperCase()}${match[2]}`; // "B1" for "Basic 1"

  // Generate two random uppercase letters
  const randomLetters = Array.from({ length: 2 })
    .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 65)) // Random letter A-Z
    .join("");

  // Generate two random numbers
  const randomNumbers = Math.floor(Math.random() * 90 + 10); // Random number between 10-99

  // Combine them into the final ID
  return `${classPrefix}${randomLetters}${randomNumbers}`;
}

export function generateTeacherId(name: string): string {
  // Extract initials from name (e.g. "John Doe" -> "JD")
  const initials = name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // Max 2 letters

  const prefix = initials || "T"; // Default to 'T' if no name

  // Generate two random uppercase letters
  const randomLetters = Array.from({ length: 2 })
    .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 65))
    .join("");

  // Generate two random numbers
  const randomNumbers = Math.floor(Math.random() * 90 + 10);

  return `${prefix}${randomLetters}${randomNumbers}`;
}


