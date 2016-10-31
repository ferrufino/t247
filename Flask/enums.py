import enum

# Enums used for different columns ###########


class SubmissionState(enum.Enum):
    """Enum used to indicate if submission has been compiled or not"""
    pending = 'pending'
    evaluated = 'evaluated'
    internal_server_error = 'internal_server_error'
    compilation_error = 'compilation_error'


class SubmissionResult(enum.Enum):
    """Enum used to indicate the final result of a submission"""
    accepted = 'accepted'
    wrong_answer = 'wrong_answer'
    time_limit_exceeded = 'time_limit_exceeded'
    memory_limit_exceeded = 'memory_limit_exceeded'
    runtime_error = 'runtime_error'