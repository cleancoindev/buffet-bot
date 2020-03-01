import React from "react";

const GelatoLogo = () => (
	<React.Fragment>
		<div
			style={{
				width: "35px",
				marginRight: "48px"
			}}
		>
			{/* Logo is an actual React component */}
			<img style={{ width: "75px" }} src="/images/buffet_bot.png" />
		</div>
		<div
			style={{
				width: "80px",
				fontSize: "24px"
			}}
		>
			{/* Logo is an actual React component */}
			<p>BuffetBot</p>
		</div>
	</React.Fragment>
);

export default GelatoLogo;
