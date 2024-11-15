import toast, { Toaster } from 'react-hot-toast';

const notify = (type, message) => {
  // Create a mapping of toast types to their respective functions
  const toastTypes = {
    success: toast.success,
    error: toast.error,
    promise: toast.promise, // You can add any other toast types here
    // Add other dynamic types like info, warning if needed
  };

  // Call the dynamically chosen toast type with the message
  if (toastTypes[type]) {
    toastTypes[type](message);
  } else {
    console.error('Invalid toast type');
  }
};

// function ReactToaster() {
//   return (
//     <div>
        
//       <button onClick={() => notify('success', 'This is a success toast!')}>Success Toast</button>
//       <button onClick={() => notify('error', 'This is an error toast!')}>Error Toast</button>
      
//       {/* You can pass any other dynamic type */}
//       <Toaster />
//     </div>
//   );
// }

// export default ReactToaster;
