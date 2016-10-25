import enum

# Enums used for different columns ###########


class SubmissionState(enum.Enum):
    """Enum used to indicate if submission has been compiled or not"""
    pending = 'pending'
    evaluated = 'evaluated'


class SubmissionResult(enum.Enum):
    """Enum used to indicate the final result of a submission"""
    accepted = 'accepted'
    wrong_answer = 'wrong_answer'
    time_limit_exceeded = 'time_limit_exceeded'
    memory_limit_exceeded = 'memory_limit_exceeded'
    compilation_error = 'compilation_error'
    execution_error = 'execution_error'