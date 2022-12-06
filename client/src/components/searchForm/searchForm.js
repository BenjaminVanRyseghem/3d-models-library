import "./searchForm.css";
import { arrayOf, func, string } from "prop-types";
import { Button, Checkbox, Form, Input } from "antd";
import React, { useMemo, useState } from "react";

function KindsFormItem({ kinds }) {
	return (
		<Form.Item
			label="Kinds"
			name="kind"
		>
			<Checkbox.Group className={"vertical"}>
				{kinds.map((kind) => (
					<Checkbox
						key={kind}
						value={kind}
					>
						{kind}
					</Checkbox>
				))}
			</Checkbox.Group>
		</Form.Item>
	);
}

function TagsFormItem({ tags }) {
	let [search, setSearch] = useState("");

	let tagsToRender = useMemo(() => {
		if (!search) {
			return tags;
		}
		let searchString = search.toLowerCase();
		return tags.filter((tag) => tag.toLowerCase().indexOf(searchString) !== -1);
	}, [tags, search]);

	return (
		<Form.Item
			className="tags-form-item"
			label="Tags"
		>
			<Form.Item
				className="tag-search"
			>
				<Input
					allowClear
					placeholder="Find a tag"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
				/>
			</Form.Item>
			<Form.Item
				className="tags-list"
				name="tag"
			>
				<Checkbox.Group className={"vertical"}>
					{tagsToRender.map((tag) => (
						<Checkbox
							key={tag}
							value={tag}
						>
							{tag}
						</Checkbox>
					))}
				</Checkbox.Group>
			</Form.Item>
		</Form.Item>
	);
}

export function SearchForm({ kinds, tags, onChange = () => {} }) {
	let [form] = Form.useForm();
	return (
		<Form
			className="search-form"
			form={form}
			initialValues={{}}
			layout="vertical"
			onFinish={onChange}
		>
			<Form.Item
				label="Name"
				name="name"
			>
				<Input
					allowClear
					placeholder="Search by name"
				/>
			</Form.Item>
			<KindsFormItem kinds={kinds}/>
			<TagsFormItem tags={tags}/>
			<Form.Item>
				<Button
					type="secondary"
					onClick={() => {
						form.resetFields();
						form.submit();
					}}
				>
					Reset
				</Button>
				<Button
					htmlType="submit"
					type="primary"
				>
					Filter
				</Button>
			</Form.Item>
		</Form>
	);
}

SearchForm.propTypes = {
	kinds: arrayOf(string),
	onChange: func.isRequired,
	tags: arrayOf(string)
};

KindsFormItem.propTypes = {
	kinds: arrayOf(string)
};

TagsFormItem.propTypes = {
	tags: arrayOf(string)
};
