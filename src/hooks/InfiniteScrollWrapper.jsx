import InfiniteScroll from "react-infinite-scroll-component";

const InfiniteScrollWrapper = ({
    data,
    fetchMore,
    hasMore,
    loader,
    endMessage,
    children
}) => {
    return (
        <InfiniteScroll
            dataLength={data.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={loader || <h4 className="text-center">Loading...</h4>}
            endMessage={endMessage || <p className="text-center">No more data</p>}
        >
            {children}
        </InfiniteScroll>
    );
};

export default InfiniteScrollWrapper;