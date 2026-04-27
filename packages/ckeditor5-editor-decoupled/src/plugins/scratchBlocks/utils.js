// A helper function that retrieves and concatenates all text within the model range.
export function getRangeText( range ) {
	return Array.from( range.getItems() ).reduce( ( rangeText, node ) => {
		if ( !( node.is( 'text' ) || node.is( 'textProxy' ) ) ) {
			return rangeText;
		}

		return rangeText + node.data;
	}, '' );
}

export function stringOrEmpty( str ) {
	return str || '';
}

export function getTextFromChild( node ) {
	while ( !node.is( '$text' ) && node.getChild( 0 ) ) {
		node = node.getChild( 0 );
	}
	return stringOrEmpty( node.data ).trim();
}
