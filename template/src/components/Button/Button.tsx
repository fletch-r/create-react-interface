import React from "react";
import "./Button.css";

type ButtonProps = {
    label: string;
}

export default function Button({ label }: ButtonProps) {
    return <button className="example-button">{label}</button>
}