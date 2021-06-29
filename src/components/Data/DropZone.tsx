import React, {DragEvent} from 'react'

type Props = {
};

const Content = (props: Props) => {
  
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Bring the endzone back to normal, maybe?
  };
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Turn the endzone red, perhaps?
  };
  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Play a little sound, possibly?
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    console.log(event)
    // Add a football image to the endzone, initiate a file upload,
    // steal the user's credit card
  };
  return (
    <div className={'endzone'} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <p>The Drop Zone</p>
    </div>
  );
}

export default Content;
