import React from "react";

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button

export interface ButtonProps {
	autofocus: boolean;
	disabled: boolean;
	form: string;
	formaction: string;
	// Default is application/x-www-form-urlencoded
	formenctype:
		| "application/x-www-form-urlencoded"
		| "multipart/form-data"
		| "text/plain";
	formmethod: "post" | "get";
	formnovalidate: boolean;
	// _self is default
	formtarget: "_self" | "_blank" | "_parent" | "_top";
	name: string;
	// submit is default
	type: "submit" | "reset" | "button";
	value: string;
	label: string;
}

// Add functionallity for Icon Buttons
// If its an icon button there has to be hidden text like
// Add to favourites
// So screen readers know to read the name Add to favourites and not the SVG

// Minimum size of 44x44 pixels

const Button = (props: ButtonProps) => {
	return <button>{props.label}</button>;
};

export default Button;
