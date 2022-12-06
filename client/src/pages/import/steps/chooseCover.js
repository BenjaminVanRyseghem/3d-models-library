import { arrayOf, func, string } from "prop-types";
import { asLocalResource } from "helpers.js";
import { Col, Image, Radio, Row, Space } from "antd";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";

export default function ChooseCover({ pictures, cover, setCover }) {
	function Content() {
		return (<Radio.Group value={cover} onChange={(event) => {
					setCover(event.target.value);
				}}>
				<Row gutter={[32, 32]} justify="space-between">
					{pictures.map((path) => <Col key={path} span={8}><Radio

						value={path}
					>
						<Image preview={false} src={asLocalResource(path)} width={200}/>
					</Radio></Col>)}
				</Row>
					<Space direction="vertical">

					</Space>
				</Radio.Group>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"Choose the entry cover"}/>
	);
}

ChooseCover.propTypes = {
	cover: string,
	pictures: arrayOf(string).isRequired,
	setCover: func.isRequired
};
