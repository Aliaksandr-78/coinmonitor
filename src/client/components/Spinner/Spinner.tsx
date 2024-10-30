const Spinner: React.FC = () => {
    return (
      <div className="flex justify-center items-center">
        <div
          className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin"
          style={{ borderTopColor: 'transparent' }}
        ></div>
      </div>
    )
  }
  
  export default Spinner
  