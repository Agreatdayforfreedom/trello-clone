import React from "react";

interface Props {
	children: React.ReactNode;
}

export const ListWrapper = ({ children }: Props) => {
	return <li className="shrink-0 h-full w-[272px]">{children}</li>;
};
