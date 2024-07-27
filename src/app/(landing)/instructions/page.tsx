import Image from "next/image";
import instructions_1 from "public/instructions-1.jpeg";

const instructions = [
  {
    title: "Step 1:",
    text: "Go to any website, pdf or tab on your browser, select some text and right click on the page to open the context menu.",
    image: instructions_1,
  },
  {
    title: "Step 2:",
    text: "When you click the Remember text option, if you are a new user, you will be sent here. If this is your second time, you will see a sidepanel show up with the text you selected and some options before sending it to the program to remember.",
    image: instructions_1,
  },
  {
    title: "Step 3:",
    text: "Based on the options you selected, you will be prompted with a few questions the next time you come to either the exact url or the top level domain of the website you saved your text from. You will either get a question every day or every month depending on your preference.",
    image: instructions_1,
  },
  {
    title: "Step 4:",
    text: "To ignore a question, click the ignore button and you will not be prompted again until your next visit. To answer a question, simply enter the answer in the text box and click the submit button. Based on how close your answer was to the original text you saved, you will see one of three icons: correct, incorrect or close enough. You will also see the original text.",
    image: instructions_1,
  },
];

export default function InstructionsPage() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full flex-col justify-around pt-[6rem]">
      {instructions.map((instruction, index) => (
        <div
          key={index}
          className="flex w-full flex-col items-center justify-between gap-4 p-5 sm:flex-row"
        >
          <div className="sm:max-w-[50%]">
            <span className="text-lg font-bold">{instruction.title}</span>{" "}
            {instruction.text}
          </div>
          <div className="rounded-md p-2 shadow-md sm:max-w-[30%]">
            <Image
              src={instruction.image}
              alt="instructions_1"
              placeholder="blur"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
