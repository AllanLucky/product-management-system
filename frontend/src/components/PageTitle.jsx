import React, { useEffect } from 'react';

function PageTitle({ title }) {

    useEffect(() => {
        // Set the browser tab title whenever `title` changes
        document.title = title || 'PrimeBrandshop';
    }, [title]);

    return null;
}

export default PageTitle;

