import { arrayOf, func, string } from "prop-types";
import { Typography } from "antd";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";
import TagsEditor from "components/tagsEditor/tagsEditor.js";

const { Paragraph } = Typography;

export default function ChooseTags({ tags, setTags, allAvailableTags }) {
	function Content() {
		return (<>
			<Paragraph>Please add optional tags to the entry</Paragraph>
			<TagsEditor allAvailableTags={allAvailableTags} tags={tags} onChange={setTags}/>
		</>);
	}

	return (
		<AbstractStep content={<Content/>} title={"Choose the tags"}/>
	);
}

ChooseTags.propTypes = {
	allAvailableTags: arrayOf(string),
	setTags: func.isRequired,
	tags: arrayOf(string).isRequired
};
