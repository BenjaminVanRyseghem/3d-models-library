import { arrayOf, func, string } from "prop-types";
import { Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export default function TagsEditor({ tags, onChange = () => {} }) {
	const [inputVisible, setInputVisible] = useState(tags.length > 0);
	const [inputValue, setInputValue] = useState("");

	const handleClose = (removedTag) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		onChange(newTags);
	};

	const showInput = () => {
		setInputVisible(true);
	};

	const handleInputConfirm = () => {
		if (inputValue && tags.indexOf(inputValue) === -1) {
			onChange([...tags, inputValue]);
		}
	};

	const forMap = (tag) => {
		const tagElem = (
			<Tag
				closable
				onClose={(event) => {
					event.preventDefault();
					handleClose(tag);
				}}
			>
				{tag}
			</Tag>
		);
		return (
			<span
				key={tag}
				style={{
					display: "inline-block"
				}}
			>
        {tagElem}
      </span>
		);
	};

	return (
		<>
			<div
				style={{
					marginBottom: 16
				}}
			/>
			{tags.map(forMap)}
			{inputVisible && (
				<Input
					autoFocus
					size="small"
					style={{
						width: 78
					}}
					type="text"
					value={inputValue}
					onBlur={handleInputConfirm}
					onChange={(event) => {
						setInputValue(event.target.value);
					}}
					onPressEnter={handleInputConfirm}
				/>
			)}
			{!inputVisible && (
				<Tag className="site-tag-plus" onClick={showInput}>
					<PlusOutlined/> New Tag
				</Tag>
			)}
		</>
	);
}

TagsEditor.propTypes = {
	onChange: func,
	tags: arrayOf(string)
};
