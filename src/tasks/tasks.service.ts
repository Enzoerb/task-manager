import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto'
import { Task, TaskStatus } from './task.model'
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto' 


@Injectable()
export class TasksService {
	private tasks: Task[] = [];
	
	getAllTasks(): Task[] {
		return this.tasks;
	}

	getTasksWithFilters(filterDto: GetTasksFilterDto){
		const { status, search } = filterDto;
		let tasks = this.getAllTasks();

		if (status) {
			tasks = tasks.filter((task) => task.status == status)
		}

		if (search) {
			tasks = tasks.filter((task) => {
											 			if (task.title.includes(search)
													 	    || task.description.includes(search)) {
										 					return true;
											 			}
											 			return false;
										 			 })
		}

		return tasks;
	}

	getTaskById(id: string): Task {
		
		var wanted_task = null;
		
		for (let task of this.tasks) {
			if (task["id"] === id)
			{
				wanted_task = task;
				break;
			}
		}	
		
		return wanted_task != null ? wanted_task : null;
	}

	createTask(createTaskDto: CreateTaskDto): Task {
		
		const { title, description } = createTaskDto;

		const task: Task = {
			id: uuid(),
			title,
			description,
			status: TaskStatus.OPEN,
		};

		this.tasks.push(task);

		return task;
	}
	
	deleteTaskById(id: string): Task[] {
		this.tasks = this.tasks.filter((task) => task.id !== id);
		return this.tasks;
	}

	updateTaskStatusById(id: string, status: TaskStatus): Task {
		const task = this.getTaskById(id);

		if (task){
			task.status = status
		}

		return task;
	}

}
