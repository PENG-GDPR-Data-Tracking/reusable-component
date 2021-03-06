/**
 * Zipkin API
 * Zipkin's v2 API currently includes a POST endpoint that can receive spans. 
 *
 * OpenAPI spec version: 2
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Annotation } from './annotation';
import { Endpoint } from './endpoint';
import { Tags } from './tags';


/**
 * A span is a single-host view of an operation. A trace is a series of spans (often RPC calls) which nest to form a latency tree. Spans are in the same trace when they share the same trace ID. The parent_id field establishes the position of one span in the tree.  The root span is where parent_id is Absent and usually has the longest duration in the trace. However, nested asynchronous work can materialize as child spans whose duration exceed the root span.  Spans usually represent remote activity such as RPC calls, or messaging producers and consumers. However, they can also represent in-process activity in any position of the trace. For example, a root span could represent a server receiving an initial client request. A root span could also represent a scheduled job that has no remote context. 
 */
export interface Span { 
    /**
     * Randomly generated, unique identifier for a trace, set on all spans within it.  Encoded as 16 or 32 lowercase hex characters corresponding to 64 or 128 bits. For example, a 128bit trace ID looks like 4e441824ec2b6a44ffdc9bb9a6453df3 
     */
    traceId: string;
    /**
     * The logical operation this span represents in lowercase (e.g. rpc method). Leave absent if unknown.  As these are lookup labels, take care to ensure names are low cardinality. For example, do not embed variables into the name. 
     */
    name?: string;
    /**
     * The parent span ID or absent if this the root span in a trace.
     */
    parentId?: string;
    /**
     * Unique 64bit identifier for this operation within the trace.  Encoded as 16 lowercase hex characters. For example ffdc9bb9a6453df3 
     */
    id: string;
    /**
     * When present, kind clarifies timestamp, duration and remoteEndpoint. When absent, the span is local or incomplete. Unlike client and server, there is no direct critical path latency relationship between producer and consumer spans.  * `CLIENT`   * timestamp is the moment a request was sent to the server. (in v1 \"cs\")   * duration is the delay until a response or an error was received. (in v1 \"cr\"-\"cs\")   * remoteEndpoint is the server. (in v1 \"sa\") * `SERVER`   * timestamp is the moment a client request was received. (in v1 \"sr\")   * duration is the delay until a response was sent or an error. (in v1 \"ss\"-\"sr\")   * remoteEndpoint is the client. (in v1 \"ca\") * `PRODUCER`   * timestamp is the moment a message was sent to a destination. (in v1  \"ms\")   * duration is the delay sending the message, such as batching.   * remoteEndpoint is the broker. * `CONSUMER`   * timestamp is the moment a message was received from an origin. (in v1 \"mr\")   * duration is the delay consuming the message, such as from backlog.   * remoteEndpoint - Represents the broker. Leave serviceName absent if unknown. 
     */
    kind?: Span.KindEnum;
    /**
     * Epoch microseconds of the start of this span, possibly absent if incomplete.  For example, 1502787600000000 corresponds to 2017-08-15 09:00 UTC  This value should be set directly by instrumentation, using the most precise value possible. For example, gettimeofday or multiplying epoch millis by 1000.  There are three known edge-cases where this could be reported absent.  * A span was allocated but never started (ex not yet received a timestamp)  * The span's start event was lost  * Data about a completed span (ex tags) were sent after the fact 
     */
    timestamp?: number;
    /**
     * Duration in **microseconds** of the critical path, if known. Durations of less than one are rounded up. Duration of children can be longer than their parents due to asynchronous operations.  For example 150 milliseconds is 150000 microseconds. 
     */
    duration?: number;
    /**
     * True is a request to store this span even if it overrides sampling policy.  This is true when the `X-B3-Flags` header has a value of 1. 
     */
    debug?: boolean;
    /**
     * True if we are contributing to a span started by another tracer (ex on a different host).
     */
    shared?: boolean;
    /**
     * The host that recorded this span, primarily for query by service name.  Instrumentation should always record this. Usually, absent implies late data. The IP address corresponding to this is usually the site local or advertised service address. When present, the port indicates the listen port. 
     */
    localEndpoint?: Endpoint;
    /**
     * When an RPC (or messaging) span, indicates the other side of the connection.  By recording the remote endpoint, your trace will contain network context even if the peer is not tracing. For example, you can record the IP from the `X-Forwarded-For` header or the service name and socket of a remote peer. 
     */
    remoteEndpoint?: Endpoint;
    /**
     * Associates events that explain latency with the time they happened.
     */
    annotations?: Array<Annotation>;
    /**
     * Tags give your span context for search, viewing and analysis.
     */
    tags?: Tags;
}
export namespace Span {
    export type KindEnum = 'CLIENT' | 'SERVER' | 'PRODUCER' | 'CONSUMER';
    export const KindEnum = {
        CLIENT: 'CLIENT' as KindEnum,
        SERVER: 'SERVER' as KindEnum,
        PRODUCER: 'PRODUCER' as KindEnum,
        CONSUMER: 'CONSUMER' as KindEnum
    };
}
