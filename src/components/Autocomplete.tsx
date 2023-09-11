import PlacesAutocomplete from "react-places-autocomplete";
type AutoCompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, placeID: string) => void;
};
export const AutoComplete = ({
  value,
  onChange,
  onSelect,
}: AutoCompleteProps) => {
  return (
    <PlacesAutocomplete value={value} onChange={onChange} onSelect={onSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className=" fixed right-5 top-5 flex flex-col text-black">
          <input
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "rounded p-2 focus:outline-none",
            })}
          />
          <div className="absolute top-12 flex flex-col ">
            {loading && (
              <div className="rounded bg-slate-300 p-2">Loading...</div>
            )}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? {
                    backgroundColor: "#808080",
                    cursor: "pointer",
                  }
                : { backgroundColor: "#ffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};
