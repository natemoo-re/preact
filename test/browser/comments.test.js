import { setupRerender } from 'preact/test-utils';
import { createElement, render, Component, Comment } from 'preact';
import { setupScratch, teardown } from '../_util/helpers';
import { logCall, clearLog, getLog } from '../_util/logCall';

/** @jsx createElement */
/* eslint-disable react/jsx-boolean-value */

describe('Fragment', () => {
	let expectDomLog = false;

	/** @type {HTMLDivElement} */
	let scratch;

	/** @type {() => void} */
	let rerender;

	let ops = [];

	function expectDomLogToBe(expectedOperations, message) {
		if (expectDomLog) {
			expect(getLog()).to.deep.equal(expectedOperations, message);
		}
	}

	class Stateful extends Component {
		componentDidUpdate() {
			ops.push('Update Stateful');
		}
		render() {
			return <div>Hello</div>;
		}
	}

	let resetInsertBefore;
	let resetAppendChild;
	let resetRemoveChild;

	before(() => {
		resetInsertBefore = logCall(Element.prototype, 'insertBefore');
		resetAppendChild = logCall(Element.prototype, 'appendChild');
		resetRemoveChild = logCall(Element.prototype, 'removeChild');
		// logCall(CharacterData.prototype, 'remove');
		// TODO: Consider logging setting set data
		// ```
		// var orgData = Object.getOwnPropertyDescriptor(CharacterData.prototype, 'data')
		// Object.defineProperty(CharacterData.prototype, 'data', {
		// 	...orgData,
		// 	get() { return orgData.get.call(this) },
		// 	set(value) { console.log('setData', value); orgData.set.call(this, value); }
		// });
		// ```
	});

	after(() => {
		resetInsertBefore();
		resetAppendChild();
		resetRemoveChild();
	});

	beforeEach(() => {
		scratch = setupScratch();
		rerender = setupRerender();
		ops = [];

		clearLog();
	});

	afterEach(() => {
		teardown(scratch);
	});

	it('should not render empty comment', () => {
		render(<Comment />, scratch);
		expect(scratch.innerHTML).to.equal('');
	});

	it('should render value as comment data', () => {
		clearLog();
		render(<Comment value="test" />, scratch);

		expect(scratch.innerHTML).to.equal('<!--test-->');
		expectDomLogToBe(['<span>.appendChild(#comment)']);
	});

	it('should render value as comment data', () => {
		clearLog();
		render(<Comment value="test" />, scratch);

		expect(scratch.innerHTML).to.equal('<!--test-->');
		expectDomLogToBe(['<span>.appendChild(#comment)']);
	});

	it('should render number values as comment data', () => {
		clearLog();
		render(<Comment value={1} />, scratch);

		expect(scratch.innerHTML).to.equal('<!--1-->');
	});

	it('should not render anything if a non-primitive value is passed as comment data', () => {
		clearLog();
		render(<Comment value={{}} />, scratch);

		expect(scratch.innerHTML).to.equal('');
	});
});
