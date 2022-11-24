import React, { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

// the function that creates the Togglable component is wrapped inside of a forwardRef function call.
// So the component can access the ref that is assigned to it.
// the component uses the useImperativeHandle hook to make its toggleVisibility function available outside of the component.
const Togglable = forwardRef((props, refs) => {
	const [visible, setVisible] = useState(false);

	const hideWhenVisible = { display: visible ? "none" : "" };
	const showWhenVisible = { display: visible ? "" : "none" };

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	useImperativeHandle(refs, () => {
		return {
			toggleVisibility,
		};
	});

	return (
		<div>
			<div style={hideWhenVisible}>
				<Button onClick={toggleVisibility} variant='contained'>
					{props.buttonLabel}
				</Button>
			</div>
			<div style={showWhenVisible} className='togglableContent'>
				{props.children}

				<Button variant='contained' onClick={toggleVisibility}>
					Cancel
				</Button>
			</div>
		</div>
	);
});

Togglable.displayName = "Togglable";
export default Togglable;

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
};
