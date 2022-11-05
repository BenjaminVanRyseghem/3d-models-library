import { arrayOf, func, string } from "prop-types";
import { AutoComplete, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export default function TagsEditor({ tags, allAvailableTags, onChange = () => {} }) {
	const [inputVisible, setInputVisible] = useState(tags.length > 0);
	const [inputValue, setInputValue] = useState("");
	let [isError, setIsError] = useState(false);

	const handleClose = (removedTag) => {
		const newTags = tags.filter((tag) => tag !== removedTag);
		onChange(newTags);
	};

	const showInput = () => {
		setInputVisible(true);
	};

	const handleInputConfirm = (value) => {
		if (value && tags.indexOf(value) === -1) {
			onChange([...tags, value]);
		} else {
			setIsError(true);
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
				<AutoComplete
					autoFocus
					dropdownMatchSelectWidth={false}
					filterOption={
						(value, option) => option.value.toUpperCase().indexOf(value.toUpperCase()) !== -1
					}
					options={allAvailableTags.map((value) => ({ value }))}
					size="small"
					status={isError ? "error" : undefined}
					style={{
						width: 78
					}}
					type="text"
					value={inputValue}
					onBlur={() => handleInputConfirm(inputValue)}
					onChange={(value) => {
						setInputValue(value);
						setIsError(false);
					}}
					onSelect={handleInputConfirm}
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
	allAvailableTags: arrayOf(string),
	onChange: func,
	tags: arrayOf(string)
};
